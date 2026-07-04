import { Router } from 'express';
import * as insightsController from '../controllers/insights.controller';

const router = Router();

router.get('/', insightsController.getInsights);
router.post('/ask', insightsController.askWorkforceQuestion);

export default router;
