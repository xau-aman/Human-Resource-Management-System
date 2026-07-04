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
  status?: string;
  notes?: string;
}

function toDate(value: string | Date | undefined): Date | undefined {
  if (!value) return undefined;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function getMinutes(value: string | Date): number {
  if (value instanceof Date) {
    return value.getHours() * 60 + value.getMinutes();
  }

  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return Number.NaN;
  }

  return hours * 60 + minutes;
}

function toDateOnly(value: string | Date): Date {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function calculateWorkingHours(checkIn: string | Date, checkOut: string | Date): number {
  const start = getMinutes(checkIn);
  const end = getMinutes(checkOut);
  if (Number.isNaN(start) || Number.isNaN(end)) {
    return 0;
  }

  const diffMinutes = end - start;
  if (diffMinutes <= 0) {
    return 0;
  }

  return Number((diffMinutes / 60).toFixed(2));
}

export function determineAttendanceStatus(checkIn?: string | Date | null): 'PRESENT' | 'ABSENT' | 'LATE' {
  if (!checkIn) {
    return 'ABSENT';
  }

  const minutes = getMinutes(checkIn);
  if (Number.isNaN(minutes)) {
    return 'ABSENT';
  }

  const lateThreshold = 9 * 60 + 15;
  return minutes <= lateThreshold ? 'PRESENT' : 'LATE';
}

export async function getAttendance({ date, employeeId }: GetAttendanceParams) {
  const where = {
    ...(date && { date: toDateOnly(date) }),
    ...(employeeId && { employeeId }),
  };

  return prisma.attendance.findMany({
    where,
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          department: { select: { name: true } },
        },
      },
    },
    orderBy: { date: 'desc' },
    take: 100,
  });
}

export async function getAttendanceSummary(date?: string) {
  const targetDate = date ? toDateOnly(date) : toDateOnly(new Date());

  const records = await prisma.attendance.groupBy({
    by: ['status'],
    where: { date: targetDate },
    _count: { status: true },
  });

  const summary = { present: 0, absent: 0, late: 0, halfDay: 0, total: 0 };
  for (const record of records) {
    const count = record._count.status;
    summary.total += count;
    if (record.status === 'PRESENT') summary.present = count;
    else if (record.status === 'ABSENT') summary.absent = count;
    else if (record.status === 'LATE') summary.late = count;
    else if (record.status === 'HALF_DAY') summary.halfDay = count;
  }

  return summary;
}

export async function getEmployeeAttendancePercentage(employeeId: string, date?: string) {
  const where = {
    employeeId,
    ...(date && { date: toDateOnly(date) }),
  };

  const [total, presentOrLate] = await Promise.all([
    prisma.attendance.count({ where }),
    prisma.attendance.count({ where: { ...where, status: { in: ['PRESENT', 'LATE'] } } }),
  ]);

  if (total === 0) {
    return 0;
  }

  return Number(((presentOrLate / total) * 100).toFixed(2));
}

export async function createAttendance(data: CreateAttendanceInput) {
  const date = toDateOnly(data.date);
  const checkIn = toDate(data.checkIn);
  const checkOut = toDate(data.checkOut);
  const computedStatus = data.status ? data.status : determineAttendanceStatus(checkIn);
  const workingHours = checkIn && checkOut ? calculateWorkingHours(checkIn, checkOut) : undefined;

  return prisma.attendance.upsert({
    where: {
      employeeId_date: {
        employeeId: data.employeeId,
        date,
      },
    },
    update: {
      checkIn,
      checkOut,
      workingHours,
      status: computedStatus as never,
      notes: data.notes,
    },
    create: {
      employeeId: data.employeeId,
      date,
      checkIn,
      checkOut,
      workingHours,
      status: computedStatus as never,
      notes: data.notes,
    },
  });
}
