import { Router } from 'express';
import * as attendanceController from '../controllers/attendance.controller';

const router = Router();

router.get('/', attendanceController.getAttendance);
router.get('/summary', attendanceController.getAttendanceSummary);
router.post('/', attendanceController.createAttendance);

export default router;
