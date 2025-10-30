import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/:accountId', getAnalytics);

export default router;


