import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';

const router = Router();

router.get('/overview', analyticsController.getWorkforceOverview);
router.get('/attendance-trend', analyticsController.getAttendanceTrend);
router.get('/department-performance', analyticsController.getDepartmentPerformance);
router.get('/employee-growth', analyticsController.getEmployeeGrowth);

export default router;
