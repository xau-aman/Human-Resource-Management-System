import { Router } from 'express';
import * as insightsController from '../controllers/insights.controller';
import { authenticate, adminOrHR } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, insightsController.getInsights);
router.post('/ask', authenticate, insightsController.askWorkforceQuestion);
router.patch('/:id/resolve', authenticate, adminOrHR, insightsController.resolveInsight);
router.post('/generate', authenticate, adminOrHR, insightsController.generateInsights);

export default router;
