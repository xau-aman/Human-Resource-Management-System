import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller';
import { authenticate, adminOrHR, allRoles } from '../middleware/auth.middleware';

const router = Router();

router.get('/departments', authenticate, allRoles, async (_req, res, next) => {
  try {
    const prisma = require('../config/prisma').default;
    const departments = await prisma.department.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } });
    res.json(require('../types/api.types').createResponse(departments));
  } catch (err) { next(err); }
});
router.get('/', authenticate, allRoles, employeeController.getEmployees);
router.get('/:id', authenticate, allRoles, employeeController.getEmployeeById);
router.post('/', authenticate, adminOrHR, employeeController.createEmployee);
router.put('/:id', authenticate, adminOrHR, employeeController.updateEmployee);
router.delete('/:id', authenticate, adminOrHR, employeeController.deleteEmployee);

export default router;
