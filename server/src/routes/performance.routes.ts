import { Router } from 'express';
import * as performanceController from '../controllers/performance.controller';
import { authenticate, allRoles } from '../middleware/auth.middleware';

const router = Router();

router.get('/summary', authenticate, allRoles, performanceController.getPerformanceSummary);
router.get('/top-performers', authenticate, allRoles, performanceController.getTopPerformers);
router.get('/trend', authenticate, allRoles, performanceController.getPerformanceTrend);
router.get('/employee/:employeeId', authenticate, allRoles, performanceController.getEmployeePerformance);
router.get('/', authenticate, allRoles, performanceController.getPerformanceReviews);
router.get('/:employeeId', authenticate, allRoles, performanceController.getEmployeePerformance);

export default router;
