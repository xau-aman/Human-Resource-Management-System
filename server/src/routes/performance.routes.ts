import { Router } from 'express';
import * as performanceController from '../controllers/performance.controller';

const router = Router();

router.get('/top-performers', performanceController.getTopPerformers);
router.get('/trend', performanceController.getPerformanceTrend);
router.get('/', performanceController.getPerformanceReviews);
router.get('/:employeeId', performanceController.getEmployeePerformance);

export default router;
