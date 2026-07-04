import { Router, Response, NextFunction } from 'express';
import { authenticate, allRoles, AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/prisma';
import { createResponse } from '../types/api.types';

const router = Router();

router.get('/me', authenticate, allRoles, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { employee: { include: { department: true } } } });
    if (!user?.employee) { res.status(404).json({ success: false, message: 'Employee not found' }); return; }

    const emp = user.employee;
    const gross = emp.salary || 0;
    const basic = Math.round(gross * 0.5);
    const hra = Math.round(gross * 0.2);
    const da = Math.round(gross * 0.1);
    const special = gross - basic - hra - da;
    const pf = Math.round(basic * 0.12);
    const tax = Math.round(gross * 0.1);
    const professionalTax = 200;
    const totalDeductions = pf + tax + professionalTax;
    const net = gross - totalDeductions;

    res.json(createResponse({
      employee: { id: emp.id, employeeId: emp.employeeId, firstName: emp.firstName, lastName: emp.lastName, designation: emp.designation, department: emp.department.name, joiningDate: emp.joiningDate },
      salary: {
        gross, net, basic, hra, da, special,
        deductions: { pf, tax, professionalTax, total: totalDeductions },
        month: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
      },
    }));
  } catch (err) { next(err); }
});

export default router;
