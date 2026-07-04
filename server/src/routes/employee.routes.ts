import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller';
import { authenticate, adminOrHR, allRoles } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, allRoles, employeeController.getEmployees);
router.get('/:id', authenticate, allRoles, employeeController.getEmployeeById);
router.post('/', authenticate, adminOrHR, employeeController.createEmployee);
router.put('/:id', authenticate, adminOrHR, employeeController.updateEmployee);
router.delete('/:id', authenticate, adminOrHR, employeeController.deleteEmployee);

export default router;
