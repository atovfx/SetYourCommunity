import { Router } from 'express';
import {
  verifyWebhook,
  handleInstagramWebhook,
  handleWhatsAppWebhook,
} from '../controllers/webhook.controller';

const router = Router();

// Verification endpoint pour les deux platforms
router.get('/instagram', verifyWebhook);
router.get('/whatsapp', verifyWebhook);

// Webhook receivers
router.post('/instagram', handleInstagramWebhook);
router.post('/whatsapp', handleWhatsAppWebhook);

export default router;


