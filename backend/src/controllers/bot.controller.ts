import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { LLMProvider } from '@prisma/client';

export const getBotConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { accountId } = req.params;

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user!.id,
      },
    });

    if (!account) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    const config = await prisma.botConfiguration.findUnique({
      where: { accountId },
    });

    res.json({ config });
  } catch (error) {
    console.error('Get bot config error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la configuration' });
  }
};

export const updateBotConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { accountId } = req.params;
    const { llmProvider, model, systemPrompt, responseStyle, mimics, temperature, maxTokens, autoReply } = req.body;

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user!.id,
      },
    });

    if (!account) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    const updateData: any = {};
    
    if (llmProvider !== undefined) updateData.llmProvider = llmProvider as LLMProvider;
    if (model !== undefined) updateData.model = model;
    if (systemPrompt !== undefined) updateData.systemPrompt = systemPrompt;
    if (responseStyle !== undefined) updateData.responseStyle = responseStyle;
    if (mimics !== undefined) updateData.mimics = mimics;
    if (temperature !== undefined) updateData.temperature = temperature;
    if (maxTokens !== undefined) updateData.maxTokens = maxTokens;
    if (autoReply !== undefined) updateData.autoReply = autoReply;

    const config = await prisma.botConfiguration.upsert({
      where: { accountId },
      update: updateData,
      create: {
        accountId,
        ...updateData,
      },
    });

    res.json({ config });
  } catch (error) {
    console.error('Update bot config error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la configuration' });
  }
};

export const addKnowledge = async (req: AuthRequest, res: Response) => {
  try {
    const { accountId } = req.params;
    const { title, content, type } = req.body;

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user!.id,
      },
    });

    if (!account) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    const knowledge = await prisma.knowledgeBase.create({
      data: {
        accountId,
        title,
        content,
        type: type || 'TEXT',
      },
    });

    res.status(201).json({ knowledge });
  } catch (error) {
    console.error('Add knowledge error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la connaissance' });
  }
};

export const getKnowledgeBase = async (req: AuthRequest, res: Response) => {
  try {
    const { accountId } = req.params;

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user!.id,
      },
    });

    if (!account) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    const knowledgeBase = await prisma.knowledgeBase.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ knowledgeBase });
  } catch (error) {
    console.error('Get knowledge base error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la base de connaissances' });
  }
};

export const deleteKnowledge = async (req: AuthRequest, res: Response) => {
  try {
    const { knowledgeId } = req.params;

    const knowledge = await prisma.knowledgeBase.findFirst({
      where: { id: knowledgeId },
      include: {
        account: true,
      },
    });

    if (!knowledge) {
      return res.status(404).json({ error: 'Connaissance non trouvée' });
    }

    if (knowledge.account.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    await prisma.knowledgeBase.delete({
      where: { id: knowledgeId },
    });

    res.json({ message: 'Connaissance supprimée avec succès' });
  } catch (error) {
    console.error('Delete knowledge error:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la connaissance' });
  }
};


