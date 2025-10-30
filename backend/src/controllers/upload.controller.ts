import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import knowledgeService from '../services/knowledge.service';
import path from 'path';

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { accountId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.user!.id,
      },
    });

    if (!account) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Extraire le texte du document
    const extractedText = await knowledgeService.extractTextFromFile(filePath);
    const sanitizedText = knowledgeService.sanitizeText(extractedText);

    // Créer l'entrée dans la knowledge base
    const knowledge = await prisma.knowledgeBase.create({
      data: {
        accountId,
        title: fileName,
        content: sanitizedText,
        fileUrl: `/uploads/${req.file.filename}`,
        type: 'DOCUMENT',
        metadata: {
          originalName: fileName,
          mimeType: req.file.mimetype,
          size: req.file.size,
        },
      },
    });

    res.status(201).json({ knowledge });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload du document' });
  }
};


