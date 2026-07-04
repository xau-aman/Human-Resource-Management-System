import { Router } from 'express';
import * as attendanceController from '../controllers/attendance.controller';

const router = Router();

router.get('/', attendanceController.getAttendance);
router.get('/summary', attendanceController.getAttendanceSummary);
router.get('/employee/:employeeId', attendanceController.getEmployeeAttendance);
router.get('/employee/:employeeId/percentage', attendanceController.getEmployeeAttendancePercentage);
router.post('/', attendanceController.createAttendance);
router.post('/check-in', attendanceController.checkInAttendance);
router.post('/check-out', attendanceController.checkOutAttendance);

export default router;
