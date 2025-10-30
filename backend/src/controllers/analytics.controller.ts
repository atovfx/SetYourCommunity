import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { ConversationStatus } from '@prisma/client';

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const { accountId } = req.params;
    const { startDate, endDate } = req.query;

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user!.id,
      },
    });

    if (!account) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate as string);
    }

    // Nombre total de conversations
    const totalConversations = await prisma.conversation.count({
      where: {
        accountId,
        ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      },
    });

    // Conversations actives
    const activeConversations = await prisma.conversation.count({
      where: {
        accountId,
        status: ConversationStatus.ACTIVE,
      },
    });

    // Conversations converties
    const convertedConversations = await prisma.conversation.count({
      where: {
        accountId,
        status: ConversationStatus.CONVERTED,
        ...(Object.keys(dateFilter).length > 0 && { updatedAt: dateFilter }),
      },
    });

    // Taux de conversion
    const conversionRate = totalConversations > 0 
      ? (convertedConversations / totalConversations) * 100 
      : 0;

    // Revenue total
    const conversions = await prisma.conversion.findMany({
      where: {
        conversation: {
          accountId,
        },
        ...(Object.keys(dateFilter).length > 0 && { conversionDate: dateFilter }),
      },
    });

    const totalRevenue = conversions.reduce((sum, conv) => sum + (conv.revenue || 0), 0);

    // Liste des conversions avec détails
    const conversionsList = await prisma.conversion.findMany({
      where: {
        conversation: {
          accountId,
        },
        ...(Object.keys(dateFilter).length > 0 && { conversionDate: dateFilter }),
      },
      include: {
        conversation: {
          select: {
            contactName: true,
            contactId: true,
            platform: true,
          },
        },
      },
      orderBy: {
        conversionDate: 'desc',
      },
    });

    // Nombre de messages échangés
    const totalMessages = await prisma.message.count({
      where: {
        conversation: {
          accountId,
        },
        ...(Object.keys(dateFilter).length > 0 && { timestamp: dateFilter }),
      },
    });

    // Messages par type
    const messagesByType = await prisma.message.groupBy({
      by: ['senderType'],
      where: {
        conversation: {
          accountId,
        },
        ...(Object.keys(dateFilter).length > 0 && { timestamp: dateFilter }),
      },
      _count: true,
    });

    res.json({
      analytics: {
        totalConversations,
        activeConversations,
        convertedConversations,
        conversionRate: conversionRate.toFixed(2),
        totalRevenue,
        totalMessages,
        messagesByType,
      },
      conversions: conversionsList,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des analytics' });
  }
};


