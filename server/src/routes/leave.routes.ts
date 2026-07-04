import { Router } from 'express';
import * as leaveController from '../controllers/leave.controller';
import { authenticate, adminHROrManager, allRoles } from '../middleware/auth.middleware';

const router = Router();

router.get('/balance', authenticate, allRoles, leaveController.getLeaveBalance);
router.get('/', authenticate, allRoles, leaveController.getLeaveRequests);
router.post('/', authenticate, allRoles, leaveController.createLeaveRequest);
router.patch('/:id/approve', authenticate, adminHROrManager, leaveController.approveLeave);
router.patch('/:id/reject', authenticate, adminHROrManager, leaveController.rejectLeave);

export default router;
