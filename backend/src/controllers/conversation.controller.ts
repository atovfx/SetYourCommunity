import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import llmService from '../services/llm.service';
import instagramService from '../services/instagram.service';
import whatsappService from '../services/whatsapp.service';
import { Platform, SenderType, ConversationStatus } from '@prisma/client';

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const { accountId } = req.params;
    const { status } = req.query;

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user!.id,
      },
    });

    if (!account) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    const where: any = { accountId };
    if (status && typeof status === 'string') {
      where.status = status as ConversationStatus;
    }

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
        conversion: true,
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des conversations' });
  }
};

export const getConversationMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
      include: {
        account: true,
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    if (conversation.account.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
    });

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
};

export const sendManualReply = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
      include: { account: true },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    if (conversation.account.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // Envoyer le message via l'API appropriée
    if (conversation.platform === Platform.INSTAGRAM) {
      await instagramService.sendMessage(
        conversation.account.accessToken,
        conversation.contactId,
        content
      );
    } else if (conversation.platform === Platform.WHATSAPP) {
      await whatsappService.sendMessage(conversation.contactId, content);
    }

    // Enregistrer le message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderType: SenderType.USER,
        content,
      },
    });

    // Mettre à jour la conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    res.json({ message });
  } catch (error) {
    console.error('Send manual reply error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
};

export const takeoverConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
      include: { account: true },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    if (conversation.account.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: { status: ConversationStatus.MANUAL },
    });

    res.json({ conversation: updatedConversation });
  } catch (error) {
    console.error('Takeover conversation error:', error);
    res.status(500).json({ error: 'Erreur lors de la prise de contrôle' });
  }
};

export const markAsConverted = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { revenue, notes } = req.body;

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
      include: { account: true },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    if (conversation.account.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // Créer la conversion
    const conversion = await prisma.conversion.create({
      data: {
        conversationId,
        revenue: revenue ? parseFloat(revenue) : null,
        notes,
      },
    });

    // Mettre à jour le statut de la conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { status: ConversationStatus.CONVERTED },
    });

    res.json({ conversion });
  } catch (error) {
    console.error('Mark as converted error:', error);
    res.status(500).json({ error: 'Erreur lors du marquage de la conversion' });
  }
};

export const processIncomingMessage = async (
  accountId: string,
  contactId: string,
  contactName: string | undefined,
  messageContent: string,
  platform: Platform,
  messageId?: string
): Promise<void> => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        botConfiguration: true,
      },
    });

    if (!account || !account.botConfiguration) {
      console.error('Account or bot configuration not found');
      return;
    }

    // Trouver ou créer la conversation
    let conversation = await prisma.conversation.findUnique({
      where: {
        accountId_contactId: {
          accountId,
          contactId,
        },
      },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          accountId,
          contactId,
          contactName,
          platform,
          lastMessageAt: new Date(),
        },
        include: {
          messages: true,
        },
      });
    }

    // Enregistrer le message entrant
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderType: SenderType.CONTACT,
        content: messageContent,
        messageId,
      },
    });

    // Si l'auto-reply est activé et la conversation n'est pas en mode manuel
    if (
      account.botConfiguration.autoReply &&
      conversation.status !== ConversationStatus.MANUAL
    ) {
      // Récupérer la knowledge base
      const knowledgeBase = await prisma.knowledgeBase.findMany({
        where: { accountId },
      });

      // Générer une réponse avec le LLM
      const response = await llmService.generateResponse({
        config: account.botConfiguration,
        knowledgeBase,
        conversationHistory: conversation.messages,
        newMessage: messageContent,
      });

      // Envoyer la réponse
      if (platform === Platform.INSTAGRAM) {
        await instagramService.sendMessage(account.accessToken, contactId, response);
      } else if (platform === Platform.WHATSAPP) {
        await whatsappService.sendMessage(contactId, response);
      }

      // Enregistrer la réponse du bot
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderType: SenderType.BOT,
          content: response,
        },
      });
    }

    // Mettre à jour lastMessageAt
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });
  } catch (error) {
    console.error('Process incoming message error:', error);
  }
};


