import { Router } from 'express';
import * as performanceController from '../controllers/performance.controller';

const router = Router();

router.get('/top-performers', performanceController.getTopPerformers);
router.get('/trend/:employeeId', performanceController.getPerformanceTrend);
router.get('/', performanceController.getPerformanceReviews);
router.get('/:employeeId', performanceController.getEmployeePerformance);
router.post('/', performanceController.createPerformanceReview);
router.post('/calculate-score', performanceController.calculateScore);

export default router;
