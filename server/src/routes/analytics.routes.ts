import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate, allRoles } from '../middleware/auth.middleware';

const router = Router();

router.get('/overview', authenticate, allRoles, analyticsController.getWorkforceOverview);
router.get('/attendance-trend', authenticate, allRoles, analyticsController.getAttendanceTrend);
router.get('/department-performance', authenticate, allRoles, analyticsController.getDepartmentPerformance);

export default router;
