import { Router, Response, NextFunction } from 'express';
import { authenticate, adminOrHR, AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/prisma';

const router = Router();

function toCsv(headers: string[], rows: string[][]): string {
  const escape = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [headers.map(escape).join(','), ...rows.map(r => r.map(escape).join(','))].join('\n');
}

router.get('/employees', authenticate, adminOrHR, async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const employees = await prisma.employee.findMany({ include: { department: true } });
    const headers = ['Employee ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Department', 'Designation', 'Salary', 'Status', 'Joining Date'];
    const rows = employees.map(e => [e.employeeId, e.firstName, e.lastName, e.email, e.phone || '', e.department.name, e.designation, String(e.salary || 0), e.employmentStatus, e.joiningDate.toISOString().split('T')[0]]);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
    res.send(toCsv(headers, rows));
  } catch (err) { next(err); }
});

router.get('/attendance', authenticate, adminOrHR, async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const records = await prisma.attendance.findMany({ include: { employee: { include: { department: true } } }, orderBy: { date: 'desc' }, take: 500 });
    const headers = ['Employee ID', 'Name', 'Department', 'Date', 'Check In', 'Check Out', 'Working Hours', 'Status'];
    const rows = records.map(r => [r.employee.employeeId, `${r.employee.firstName} ${r.employee.lastName}`, r.employee.department.name, r.date.toISOString().split('T')[0], r.checkIn?.toISOString() || '', r.checkOut?.toISOString() || '', String(r.workingHours || 0), r.status]);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
    res.send(toCsv(headers, rows));
  } catch (err) { next(err); }
});

router.get('/leaves', authenticate, adminOrHR, async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const leaves = await prisma.leaveRequest.findMany({ include: { employee: { include: { department: true } } }, orderBy: { createdAt: 'desc' } });
    const headers = ['Employee ID', 'Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Reason', 'Status'];
    const rows = leaves.map(l => [l.employee.employeeId, `${l.employee.firstName} ${l.employee.lastName}`, l.employee.department.name, l.leaveType, l.startDate.toISOString().split('T')[0], l.endDate.toISOString().split('T')[0], l.reason, l.status]);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leaves.csv');
    res.send(toCsv(headers, rows));
  } catch (err) { next(err); }
});

router.get('/performance', authenticate, adminOrHR, async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reviews = await prisma.performanceReview.findMany({ include: { employee: { include: { department: true } } }, orderBy: { createdAt: 'desc' } });
    const headers = ['Employee ID', 'Name', 'Department', 'Review Period', 'Tasks Completed', 'Goals Achieved', 'Total Goals', 'Manager Rating', 'Overall Score'];
    const rows = reviews.map(r => [r.employee.employeeId, `${r.employee.firstName} ${r.employee.lastName}`, r.employee.department.name, r.reviewPeriod, String(r.tasksCompleted), String(r.goalsAchieved), String(r.totalGoals), String(r.managerRating), String(r.overallScore)]);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=performance.csv');
    res.send(toCsv(headers, rows));
  } catch (err) { next(err); }
});

export default router;
