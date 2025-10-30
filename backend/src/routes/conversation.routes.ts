import { Router } from 'express';
import { body } from 'express-validator';
import {
  getConversations,
  getConversationMessages,
  sendManualReply,
  takeoverConversation,
  markAsConverted,
} from '../controllers/conversation.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.get('/accounts/:accountId/conversations', getConversations);
router.get('/:conversationId/messages', getConversationMessages);

router.post(
  '/:conversationId/manual-reply',
  [
    body('content').notEmpty().withMessage('Le contenu du message est requis'),
    validate,
  ],
  sendManualReply
);

router.put('/:conversationId/takeover', takeoverConversation);

router.post('/:conversationId/mark-converted', markAsConverted);

export default router;


