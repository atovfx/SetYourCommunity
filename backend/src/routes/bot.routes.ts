import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import {
  getBotConfig,
  updateBotConfig,
  addKnowledge,
  getKnowledgeBase,
  deleteKnowledge,
} from '../controllers/bot.controller';
import { uploadDocument } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté'));
    }
  },
});

router.use(authenticate);

router.get('/:accountId/config', getBotConfig);
router.put('/:accountId/config', updateBotConfig);

router.get('/:accountId/knowledge-base', getKnowledgeBase);
router.post(
  '/:accountId/knowledge-base',
  [
    body('title').notEmpty().withMessage('Le titre est requis'),
    body('content').notEmpty().withMessage('Le contenu est requis'),
    validate,
  ],
  addKnowledge
);
router.post('/:accountId/knowledge-base/upload', upload.single('document'), uploadDocument);

router.delete('/knowledge-base/:knowledgeId', deleteKnowledge);

export default router;


