import { Router } from 'express';
import { body } from 'express-validator';
import {
  connectInstagram,
  instagramCallback,
  connectWhatsApp,
  getAccounts,
  deleteAccount,
} from '../controllers/account.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Routes protégées
router.get('/', authenticate, getAccounts);
router.get('/connect/instagram', authenticate, connectInstagram);

router.post(
  '/connect/whatsapp',
  authenticate,
  [
    body('phoneNumber').notEmpty().withMessage('Le numéro de téléphone est requis'),
    body('accessToken').notEmpty().withMessage('Le token d\'accès est requis'),
    body('accountId').notEmpty().withMessage('L\'ID du compte est requis'),
    validate,
  ],
  connectWhatsApp
);

router.delete('/:id', authenticate, deleteAccount);

export default router;

