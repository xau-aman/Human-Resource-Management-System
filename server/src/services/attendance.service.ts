import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

interface GetAttendanceParams {
  date?: string;
  employeeId?: string;
}

interface CreateAttendanceInput {
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
}

export function calculateWorkingHours(checkIn: Date, checkOut: Date): number {
  const diffMs = checkOut.getTime() - checkIn.getTime();
  return parseFloat((diffMs / 3600000).toFixed(2));
}

export async function getAttendance({ date, employeeId }: GetAttendanceParams) {
  const where: any = {};
  if (date) where.date = new Date(date);
  if (employeeId) where.employeeId = employeeId;

  return prisma.attendance.findMany({
    where,
    include: { employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, department: { select: { id: true, name: true } } } } },
    orderBy: { date: 'desc' },
    take: 100,
  });
}

export async function getMyAttendance(employeeId: string) {
  return prisma.attendance.findMany({
    where: { employeeId },
    include: { employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, department: { select: { id: true, name: true } } } } },
    orderBy: { date: 'desc' },
    take: 30,
  });
}

export async function getAttendanceSummary(date?: string) {
  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  const records = await prisma.attendance.groupBy({
    by: ['status'],
    where: { date: targetDate },
    _count: { status: true },
  });

  const summary = { present: 0, absent: 0, late: 0, halfDay: 0, total: 0 };
  for (const r of records) {
    const count = r._count.status;
    summary.total += count;
    if (r.status === 'PRESENT') summary.present = count;
    else if (r.status === 'ABSENT') summary.absent = count;
    else if (r.status === 'LATE') summary.late = count;
    else if (r.status === 'HALF_DAY') summary.halfDay = count;
  }
  return summary;
}

export async function clockIn(userId: string) {
  // Find employee by userId
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { employee: true } });
  if (!user?.employee) throw new AppError('Employee profile not found', 404);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if already clocked in today
  const existing = await prisma.attendance.findFirst({
    where: { employeeId: user.employee.id, date: today },
  });

  if (existing) throw new AppError('Already clocked in today', 400);

  const now = new Date();
  const hour = now.getHours();
  const status = hour >= 10 ? 'LATE' : 'PRESENT';

  return prisma.attendance.create({
    data: { employeeId: user.employee.id, date: today, checkIn: now, status },
    include: { employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, department: { select: { id: true, name: true } } } } },
  });
}

export async function clockOut(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { employee: true } });
  if (!user?.employee) throw new AppError('Employee profile not found', 404);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.attendance.findFirst({
    where: { employeeId: user.employee.id, date: today },
  });

  if (!existing) throw new AppError('Not clocked in today', 400);
  if (existing.checkOut) throw new AppError('Already clocked out', 400);

  const now = new Date();
  const workingHours = existing.checkIn ? calculateWorkingHours(existing.checkIn, now) : undefined;

  return prisma.attendance.update({
    where: { id: existing.id },
    data: { checkOut: now, workingHours },
    include: { employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, department: { select: { id: true, name: true } } } } },
  });
}

export async function createAttendance(data: CreateAttendanceInput) {
  const checkIn = data.checkIn ? new Date(data.checkIn) : undefined;
  const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;
  const workingHours = checkIn && checkOut ? calculateWorkingHours(checkIn, checkOut) : undefined;

  return prisma.attendance.create({
    data: { ...data, date: new Date(data.date), checkIn, checkOut, workingHours },
  });
}
