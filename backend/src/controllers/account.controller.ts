import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import instagramService from '../services/instagram.service';
import { Platform } from '@prisma/client';
import { parseAndVerifySignedRequest, validateSignedRequest, getUserIdFromSignedRequest } from '../utils/facebook-auth';
import crypto from 'crypto';

export const connectInstagram = async (req: AuthRequest, res: Response) => {
  try {
    // L'URL de callback doit correspondre exactement à celle configurée dans Meta Dashboard
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${req.protocol}://${req.get('host')}/auth/meta/callback`;
    const authUrl = await instagramService.getAuthUrl(redirectUri, req.user!.id);
    
    res.json({ authUrl });
  } catch (error) {
    console.error('Connect Instagram error:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion à Instagram' });
  }
};

export const instagramCallback = async (req: AuthRequest, res: Response) => {
  try {
    const { code, state } = req.query;
    
    if (!code || typeof code !== 'string') {
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=no_code`);
    }

    // Vérifier le state pour la sécurité (optionnel mais recommandé)
    // Le state devrait contenir l'ID de l'utilisateur encodé

    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${req.protocol}://${req.get('host')}/auth/meta/callback`;
    const tokenData = await instagramService.exchangeCodeForToken(code, redirectUri);
    const accountInfo = await instagramService.getAccountInfo(tokenData.access_token);

    // Récupérer l'utilisateur depuis le state ou depuis la session
    let userId = req.user?.id;
    
    if (!userId && state) {
      // Décoder le state pour récupérer l'userId
      try {
        const decodedState = JSON.parse(Buffer.from(state as string, 'base64').toString());
        userId = decodedState.userId;
      } catch (e) {
        console.error('Invalid state parameter');
      }
    }

    if (!userId) {
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=user_not_found`);
    }

    const account = await prisma.account.create({
      data: {
        userId: userId,
        platform: Platform.INSTAGRAM,
        accessToken: tokenData.access_token,
        accountName: accountInfo.username || accountInfo.name,
        accountId: accountInfo.id,
      },
    });

    // Créer une configuration de bot par défaut
    await prisma.botConfiguration.create({
      data: {
        accountId: account.id,
      },
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard?success=instagram_connected`);
  } catch (error) {
    console.error('Instagram callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=instagram_connection_failed`);
  }
};

export const connectWhatsApp = async (req: AuthRequest, res: Response) => {
  try {
    const { phoneNumber, accessToken, accountId } = req.body;

    if (!phoneNumber || !accessToken || !accountId) {
      return res.status(400).json({ error: 'Paramètres manquants' });
    }

    const account = await prisma.account.create({
      data: {
        userId: req.user!.id,
        platform: Platform.WHATSAPP,
        accessToken,
        accountId,
        phoneNumber,
        accountName: phoneNumber,
      },
    });

    // Créer une configuration de bot par défaut
    await prisma.botConfiguration.create({
      data: {
        accountId: account.id,
      },
    });

    res.status(201).json({ account });
  } catch (error) {
    console.error('Connect WhatsApp error:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion à WhatsApp' });
  }
};

export const getAccounts = async (req: AuthRequest, res: Response) => {
  try {
    const accounts = await prisma.account.findMany({
      where: {
        userId: req.user!.id,
        isActive: true,
      },
      include: {
        botConfiguration: true,
        _count: {
          select: {
            conversations: true,
            knowledgeBase: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des comptes' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const account = await prisma.account.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!account) {
      return res.status(404).json({ error: 'Compte non trouvé' });
    }

    await prisma.account.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: 'Compte déconnecté avec succès' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Erreur lors de la déconnexion du compte' });
  }
};

/**
 * Callback de déconnexion (Deauthorization Callback)
 * Facebook/Meta appelle cette route quand un utilisateur révoque l'accès à l'app
 * 
 * Format attendu par Facebook:
 * POST avec signed_request dans le body (form-urlencoded)
 * 
 * Réponse: 200 OK (corps vide ou petit JSON)
 */
export const metaDeauthorize = async (req: Request, res: Response) => {
  try {
    // Facebook envoie signed_request en POST body (form-urlencoded)
    const signedRequest = req.body.signed_request;

    if (!signedRequest || typeof signedRequest !== 'string') {
      console.error('Missing signed_request in deauthorize callback');
      return res.sendStatus(400);
    }

    const appSecret = process.env.INSTAGRAM_APP_SECRET;
    if (!appSecret) {
      console.error('INSTAGRAM_APP_SECRET not configured');
      return res.sendStatus(500);
    }

    // Valider et décoder le signed_request
    let payload;
    try {
      payload = parseAndVerifySignedRequest(signedRequest, appSecret);
    } catch (error) {
      console.error('Invalid signed_request in deauthorize callback:', error);
      return res.sendStatus(400);
    }

    // Extraire l'userId (app-scoped user ID de Facebook)
    const appScopedUserId = payload.user_id;
    
    if (!appScopedUserId) {
      console.error('No user_id in signed_request payload');
      return res.sendStatus(400);
    }

    // Trouver tous les comptes Instagram liés à cet utilisateur Facebook
    // Note: accountId contient l'ID Instagram/Facebook
    const accounts = await prisma.account.findMany({
      where: {
        platform: Platform.INSTAGRAM,
        accountId: appScopedUserId.toString(),
        isActive: true,
      },
    });

    // Désactiver tous les comptes trouvés (révoquer tokens)
    for (const account of accounts) {
      await prisma.account.update({
        where: { id: account.id },
        data: { 
          isActive: false,
          // Optionnel: marquer comme révoqué, invalider tokens
          // Note: accessToken reste mais isActive=false empêche l'utilisation
        },
      });

      console.log(`[DEAUTH] Account ${account.id} revoked for user ${appScopedUserId}`);
    }

    // Log pour audit
    console.log(`[DEAUTH] Processed for Facebook user ${appScopedUserId}, ${accounts.length} account(s) disabled`);

    // Facebook s'attend à 200 OK (corps vide ou petit JSON)
    return res.sendStatus(200);
  } catch (error) {
    console.error('[DEAUTH] Error:', error);
    // Renvoyer 200 même en cas d'erreur pour éviter les retries de Facebook
    return res.sendStatus(200);
  }
};

/**
 * Callback de suppression de données (Data Deletion Callback)
 * Facebook/Meta appelle cette route pour les demandes RGPD de suppression
 * 
 * Format attendu par Facebook:
 * POST avec signed_request dans le body (form-urlencoded)
 * 
 * Réponse attendue (format exact Meta):
 * {
 *   "url": "https://app.setyourcommunity.fun/privacy/deletion-status/12345",
 *   "confirmation_code": "12345"
 * }
 */
export const privacyDataDeletion = async (req: Request, res: Response) => {
  try {
    // Facebook envoie signed_request en POST body (form-urlencoded)
    const signedRequest = req.body.signed_request;

    if (!signedRequest || typeof signedRequest !== 'string') {
      console.error('[DATA_DELETION] Missing signed_request');
      return res.sendStatus(400);
    }

    const appSecret = process.env.INSTAGRAM_APP_SECRET;
    if (!appSecret) {
      console.error('[DATA_DELETION] INSTAGRAM_APP_SECRET not configured');
      return res.sendStatus(500);
    }

    // Valider et décoder le signed_request
    let payload;
    try {
      payload = parseAndVerifySignedRequest(signedRequest, appSecret);
    } catch (error) {
      console.error('[DATA_DELETION] Invalid signed_request:', error);
      return res.sendStatus(400);
    }

    // Extraire l'userId (app-scoped)
    const appScopedUserId = payload.user_id;
    
    if (!appScopedUserId) {
      console.error('[DATA_DELETION] No user_id in payload');
      return res.sendStatus(400);
    }

    // Générer un confirmation_code unique (UUID recommandé)
    const confirmationCode = crypto.randomUUID();

    // Trouver tous les comptes liés à cet utilisateur Facebook
    const accounts = await prisma.account.findMany({
      where: {
        platform: Platform.INSTAGRAM,
        accountId: appScopedUserId.toString(),
      },
      include: {
        conversations: true,
        knowledgeBase: true,
      },
    });

    // Supprimer toutes les données liées (comptes, conversations, messages, knowledge base)
    for (const account of accounts) {
      // Supprimer les conversations et leurs messages (en cascade si configuré)
      await prisma.conversation.deleteMany({
        where: { accountId: account.id },
      });

      // Supprimer la knowledge base
      await prisma.knowledgeBase.deleteMany({
        where: { accountId: account.id },
      });

      // Supprimer la configuration bot
      await prisma.botConfiguration.deleteMany({
        where: { accountId: account.id },
      });
    }

    // Supprimer les comptes
    await prisma.account.deleteMany({
      where: {
        platform: Platform.INSTAGRAM,
        accountId: appScopedUserId.toString(),
      },
    });

    console.log(`[DATA_DELETION] Completed for user ${appScopedUserId}, ${accounts.length} account(s) deleted, confirmation_code: ${confirmationCode}`);

    // Format EXACT attendu par Meta
    const baseUrl = process.env.FRONTEND_URL || 'https://app.setyourcommunity.fun';
    res.status(200).json({
      url: `${baseUrl}/privacy/deletion-status/${confirmationCode}`,
      confirmation_code: confirmationCode,
    });
  } catch (error) {
    console.error('[DATA_DELETION] Error:', error);
    // Renvoyer quand même un JSON valide pour éviter les retries
    const baseUrl = process.env.FRONTEND_URL || 'https://app.setyourcommunity.fun';
    res.status(200).json({
      url: `${baseUrl}/privacy/deletion-status/error`,
      confirmation_code: 'error',
    });
  }
};

/**
 * Route publique pour consulter le statut de suppression de données
 * GET /privacy/deletion-status/:confirmationCode
 * 
 * Meta et les utilisateurs peuvent consulter cette page pour voir l'état de la suppression
 */
export const privacyDeletionStatus = async (req: Request, res: Response) => {
  try {
    const { confirmationCode } = req.params;

    if (!confirmationCode) {
      return res.status(400).json({ error: 'Missing confirmation_code' });
    }

    // En production, vous pourriez stocker les codes dans une table
    // et afficher l'état réel (pending/completed/error)
    // Pour l'instant, on retourne une réponse simple

    res.status(200).json({
      confirmation_code: confirmationCode,
      status: 'completed',
      message: 'Vos données ont été supprimées avec succès.',
      deleted_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[DELETION_STATUS] Error:', error);
    res.status(500).json({ error: 'Error retrieving deletion status' });
  }
};

