import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

interface GetLeaveParams {
  status?: string;
  employeeId?: string;
}

interface CreateLeaveInput {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface LeaveBalanceSummary {
  employeeId: string;
  leaveType: string;
  annualBalance: number;
  usedDays: number;
  remainingBalance: number;
}

type LeaveTypeKey = 'CASUAL' | 'SICK' | 'PAID' | 'UNPAID';

const leaveInclude = {
  employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, department: { select: { name: true } } } },
};

const annualLeavePolicy: Record<LeaveTypeKey, number | null> = {
  CASUAL: 12,
  SICK: 10,
  PAID: 15,
  UNPAID: null,
};

function normalizeLeaveType(leaveType: string): LeaveTypeKey {
  const normalized = leaveType.toUpperCase();
  if (normalized in annualLeavePolicy) {
    return normalized as LeaveTypeKey;
  }

  throw new AppError(`Unsupported leave type: ${leaveType}`, 400);
}

export function calculateLeaveDays(startDate: string | Date, endDate: string | Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new AppError('Invalid leave date range', 400);
  }

  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) {
    throw new AppError('Start date must be before end date', 400);
  }

  return Math.floor(diffMs / 86_400_000) + 1;
}

export async function getLeaveBalance(employeeId: string, leaveType: string): Promise<LeaveBalanceSummary> {
  const normalizedLeaveType = normalizeLeaveType(leaveType);
  const annualBalance = annualLeavePolicy[normalizedLeaveType];

  const approvedLeaves = await prisma.leaveRequest.findMany({
    where: {
      employeeId,
      leaveType: normalizedLeaveType,
      status: 'APPROVED',
    },
    select: { startDate: true, endDate: true },
  });

  const usedDays = approvedLeaves.reduce((sum, current) => sum + calculateLeaveDays(current.startDate, current.endDate), 0);
  const remainingBalance = annualBalance === null ? Number.POSITIVE_INFINITY : Math.max(0, annualBalance - usedDays);

  return {
    employeeId,
    leaveType: normalizedLeaveType,
    annualBalance: annualBalance ?? 0,
    usedDays,
    remainingBalance,
  };
}

export async function validateLeaveRequest(data: { employeeId: string; leaveType: string; startDate: string; endDate: string }) {
  const days = calculateLeaveDays(data.startDate, data.endDate);
  if (days <= 0) {
    throw new AppError('Leave request must span at least one day', 400);
  }

  const employee = await prisma.employee.findUnique({ where: { id: data.employeeId } });
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  if (employee.employmentStatus !== 'ACTIVE') {
    throw new AppError('Only active employees can request leave', 400);
  }

  const existingLeave = await prisma.leaveRequest.findFirst({
    where: {
      employeeId: data.employeeId,
      status: { not: 'REJECTED' },
      startDate: { lte: new Date(data.endDate) },
      endDate: { gte: new Date(data.startDate) },
    },
  });

  if (existingLeave) {
    throw new AppError('Leave request overlaps with an existing leave request', 400);
  }

  const balance = await getLeaveBalance(data.employeeId, data.leaveType);
  if (balance.remainingBalance !== Number.POSITIVE_INFINITY && balance.remainingBalance < days) {
    throw new AppError(`Insufficient ${data.leaveType.toLowerCase()} leave balance`, 400);
  }

  return { days, balance };
}

export async function getLeaveRequests({ status, employeeId }: GetLeaveParams) {
  return prisma.leaveRequest.findMany({
    where: {
      ...(status && { status }),
      ...(employeeId && { employeeId }),
    },
    include: leaveInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function createLeaveRequest(data: CreateLeaveInput) {
  await validateLeaveRequest(data);

  return prisma.leaveRequest.create({
    data: {
      employeeId: data.employeeId,
      leaveType: normalizeLeaveType(data.leaveType),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      reason: data.reason,
    },
    include: leaveInclude,
  });
}

export async function approveLeave(id: string, actorRole?: string) {
  const leave = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!leave) throw new AppError('Leave request not found', 404);
  if (leave.status !== 'PENDING') throw new AppError('Leave request is not pending', 400);

  const normalizedRole = actorRole?.toUpperCase();
  if (!normalizedRole || !['HR', 'ADMIN', 'MANAGER'].includes(normalizedRole)) {
    throw new AppError('Only HR, ADMIN or MANAGER can approve leave requests', 403);
  }

  return prisma.leaveRequest.update({ where: { id }, data: { status: 'APPROVED', reviewedAt: new Date() }, include: leaveInclude });
}

export async function rejectLeave(id: string, actorRole?: string) {
  const leave = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!leave) throw new AppError('Leave request not found', 404);
  if (leave.status !== 'PENDING') throw new AppError('Leave request is not pending', 400);

  const normalizedRole = actorRole?.toUpperCase();
  if (!normalizedRole || !['HR', 'ADMIN', 'MANAGER'].includes(normalizedRole)) {
    throw new AppError('Only HR, ADMIN or MANAGER can reject leave requests', 403);
  }

  return prisma.leaveRequest.update({ where: { id }, data: { status: 'REJECTED', reviewedAt: new Date() }, include: leaveInclude });
}
