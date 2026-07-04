import { Router } from 'express';
import * as attendanceController from '../controllers/attendance.controller';
import { authenticate, allRoles, adminOrHR } from '../middleware/auth.middleware';

const router = Router();

router.get('/summary', authenticate, allRoles, attendanceController.getAttendanceSummary);
router.get('/me', authenticate, allRoles, attendanceController.getMyAttendance);
router.get('/', authenticate, allRoles, attendanceController.getAttendance);
router.post('/clock-in', authenticate, allRoles, attendanceController.clockIn);
router.post('/clock-out', authenticate, allRoles, attendanceController.clockOut);
router.post('/', authenticate, adminOrHR, attendanceController.createAttendance);

export default router;
