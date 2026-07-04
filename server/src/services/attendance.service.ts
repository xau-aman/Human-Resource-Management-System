import prisma from '../config/prisma';

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

/**
 * Calculate working hours between check-in and check-out.
 * TODO[ATTENDANCE]: Implement attendance calculation logic
 * Expected inputs: checkIn (Date), checkOut (Date)
 * Expected output: number (hours worked, e.g. 8.5)
 */
export function calculateWorkingHours(checkIn: Date, checkOut: Date): number {
  const diffMs = checkOut.getTime() - checkIn.getTime();
  return parseFloat((diffMs / 3600000).toFixed(2));
}

export async function getAttendance({ date, employeeId }: GetAttendanceParams) {
  const where = {
    ...(date && { date: new Date(date) }),
    ...(employeeId && { employeeId }),
  };
  return prisma.attendance.findMany({
    where,
    include: { employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, department: { select: { name: true } } } } },
    orderBy: { date: 'desc' },
    take: 100,
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

export async function createAttendance(data: CreateAttendanceInput) {
  const checkIn = data.checkIn ? new Date(data.checkIn) : undefined;
  const checkOut = data.checkOut ? new Date(data.checkOut) : undefined;
  const workingHours = checkIn && checkOut ? calculateWorkingHours(checkIn, checkOut) : undefined;

  return prisma.attendance.create({
    data: { ...data, date: new Date(data.date), checkIn, checkOut, workingHours },
  });
}
