import { Router } from 'express';
import * as leaveController from '../controllers/leave.controller';

const router = Router();

router.get('/', leaveController.getLeaveRequests);
router.get('/balance/:employeeId', leaveController.getLeaveBalance);
router.post('/validate', leaveController.validateLeaveRequest);
router.post('/', leaveController.createLeaveRequest);
router.patch('/:id/approve', leaveController.approveLeave);
router.patch('/:id/reject', leaveController.rejectLeave);

export default router;
