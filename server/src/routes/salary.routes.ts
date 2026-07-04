import { Router, Response, NextFunction } from 'express';
import { authenticate, adminOrHR, AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/prisma';
import { createResponse } from '../types/api.types';
import { calculateSalaryBreakdown, DEFAULT_SALARY_COMPONENTS, validateSalaryStructure, calculateYearlyWage } from '../utils/salary';
import { canViewSalary } from '../utils/permissions';
import { AppError } from '../utils/AppError';

const router = Router();

// GET /employees/:employeeId/salary — Get salary structure
router.get('/:employeeId/salary', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!canViewSalary(req.user!.role)) throw new AppError('Forbidden: insufficient permissions to view salary', 403);

    const { employeeId } = req.params;
    const structure = await prisma.salaryStructure.findUnique({
      where: { employeeId },
      include: { components: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!structure) {
      res.json(createResponse(null, 'No salary structure configured'));
      return;
    }

    const components = structure.components.map(c => ({
      name: c.name, code: c.code, calculationType: c.calculationType,
      percentage: c.percentage, fixedAmount: c.fixedAmount, calculationBase: c.calculationBase,
    }));

    const breakdown = calculateSalaryBreakdown(structure.monthlyWage, components);

    res.json(createResponse({ ...structure, breakdown }));
  } catch (err) { next(err); }
});

// GET /employees/:employeeId/salary/breakdown — Get calculated breakdown
router.get('/:employeeId/salary/breakdown', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!canViewSalary(req.user!.role)) throw new AppError('Forbidden', 403);

    const { employeeId } = req.params;
    const structure = await prisma.salaryStructure.findUnique({
      where: { employeeId },
      include: { components: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!structure) { res.json(createResponse(null)); return; }

    const components = structure.components.map(c => ({
      name: c.name, code: c.code, calculationType: c.calculationType,
      percentage: c.percentage, fixedAmount: c.fixedAmount, calculationBase: c.calculationBase,
    }));

    const breakdown = calculateSalaryBreakdown(structure.monthlyWage, components);
    res.json(createResponse(breakdown));
  } catch (err) { next(err); }
});

// PUT /employees/:employeeId/salary — Update salary structure
router.put('/:employeeId/salary', authenticate, adminOrHR, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { employeeId } = req.params;
    const { monthlyWage, workingDaysPerWeek, workingHoursPerDay, breakTimeMinutes } = req.body;

    if (!monthlyWage || monthlyWage <= 0) throw new AppError('Monthly wage must be positive', 400);

    const validation = validateSalaryStructure(monthlyWage, DEFAULT_SALARY_COMPONENTS);
    if (!validation.valid) throw new AppError(validation.error!, 400);

    const yearlyWage = calculateYearlyWage(monthlyWage);

    const structure = await prisma.salaryStructure.upsert({
      where: { employeeId },
      update: { monthlyWage, yearlyWage, workingDaysPerWeek: workingDaysPerWeek ?? 5, workingHoursPerDay: workingHoursPerDay ?? 8, breakTimeMinutes: breakTimeMinutes ?? 60 },
      create: { employeeId, monthlyWage, yearlyWage, wageType: 'FIXED', workingDaysPerWeek: workingDaysPerWeek ?? 5, workingHoursPerDay: workingHoursPerDay ?? 8, breakTimeMinutes: breakTimeMinutes ?? 60 },
    });

    // Upsert default components
    await prisma.salaryComponent.deleteMany({ where: { salaryStructureId: structure.id } });
    for (let i = 0; i < DEFAULT_SALARY_COMPONENTS.length; i++) {
      const comp = DEFAULT_SALARY_COMPONENTS[i];
      await prisma.salaryComponent.create({
        data: { salaryStructureId: structure.id, name: comp.name, code: comp.code, calculationType: comp.calculationType, percentage: comp.percentage, fixedAmount: comp.fixedAmount, calculationBase: comp.calculationBase, sortOrder: i },
      });
    }

    // Also update employee.salary field for backward compat
    await prisma.employee.update({ where: { id: employeeId }, data: { salary: monthlyWage } });

    const full = await prisma.salaryStructure.findUnique({ where: { employeeId }, include: { components: { orderBy: { sortOrder: 'asc' } } } });
    res.json(createResponse(full, 'Salary structure updated'));
  } catch (err) { next(err); }
});

export default router;
