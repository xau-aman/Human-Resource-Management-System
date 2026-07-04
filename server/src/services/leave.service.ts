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

// Leave balance policy
const LEAVE_BALANCE_POLICY: Record<string, number> = {
  CASUAL: 12,
  SICK: 10,
  PAID: 15,
  UNPAID: Infinity, // Unlimited
};

const leaveInclude = {
  employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, designation: true, employmentStatus: true, department: { select: { name: true } } } },
};

/**
 * Calculate number of days between two dates (inclusive of both start and end date)
 */
export function calculateLeaveDays(startDate: Date | string, endDate: Date | string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

/**
 * Get leave balance for an employee for a specific year
 */
export async function getLeaveBalance(employeeId: string, year: number = new Date().getFullYear()) {
  let balance = await prisma.leaveBalance.findUnique({
    where: {
      employeeId_year: {
        employeeId,
        year,
      },
    },
  });

  // Create balance if it doesn't exist
  if (!balance) {
    balance = await prisma.leaveBalance.create({
      data: {
        employeeId,
        year,
        casualUsed: 0,
        sickUsed: 0,
        paidUsed: 0,
        unpaidUsed: 0,
      },
    });
  }

  return {
    casual: LEAVE_BALANCE_POLICY.CASUAL - balance.casualUsed,
    sick: LEAVE_BALANCE_POLICY.SICK - balance.sickUsed,
    paid: LEAVE_BALANCE_POLICY.PAID - balance.paidUsed,
    unpaid: LEAVE_BALANCE_POLICY.UNPAID === Infinity ? Infinity : LEAVE_BALANCE_POLICY.UNPAID - balance.unpaidUsed,
    used: {
      casual: balance.casualUsed,
      sick: balance.sickUsed,
      paid: balance.paidUsed,
      unpaid: balance.unpaidUsed,
    },
  };
}

/**
 * Validate leave request before creation
 */
export async function validateLeaveRequest(data: CreateLeaveInput): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  // Get employee
  const employee = await prisma.employee.findUnique({ where: { id: data.employeeId } });
  if (!employee) {
    errors.push('Employee not found');
    return { valid: false, errors };
  }

  // Check if employee is active
  if (employee.employmentStatus !== 'ACTIVE') {
    errors.push(`Employee is ${employee.employmentStatus.toLowerCase()}. Only active employees can request leave`);
  }

  // Parse dates
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  // Validate date range
  if (startDate > endDate) {
    errors.push('Start date must be before end date');
  }

  // Calculate leave days
  const leaveDays = calculateLeaveDays(startDate, endDate);

  // Check for overlapping leaves
  const overlappingLeaves = await prisma.leaveRequest.findMany({
    where: {
      employeeId: data.employeeId,
      status: { in: ['APPROVED', 'PENDING'] },
      OR: [
        {
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      ],
    },
  });

  if (overlappingLeaves.length > 0) {
    errors.push('Leave dates overlap with existing approved or pending leave requests');
  }

  // Check available balance
  const balance = await getLeaveBalance(data.employeeId);
  const leaveType = data.leaveType.toUpperCase();

  if (leaveType === 'CASUAL' && balance.casual < leaveDays) {
    errors.push(`Insufficient casual leave balance. Available: ${balance.casual}, Requested: ${leaveDays}`);
  } else if (leaveType === 'SICK' && balance.sick < leaveDays) {
    errors.push(`Insufficient sick leave balance. Available: ${balance.sick}, Requested: ${leaveDays}`);
  } else if (leaveType === 'PAID' && balance.paid < leaveDays) {
    errors.push(`Insufficient paid leave balance. Available: ${balance.paid}, Requested: ${leaveDays}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
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
  // Validate leave request
  const validation = await validateLeaveRequest(data);
  if (!validation.valid) {
    throw new AppError(`Leave validation failed: ${validation.errors.join(', ')}`, 400);
  }

  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);

  return prisma.leaveRequest.create({
    data: {
      employeeId: data.employeeId,
      leaveType: data.leaveType.toUpperCase() as any,
      startDate,
      endDate,
      reason: data.reason,
      status: 'PENDING',
    },
    include: leaveInclude,
  });
}

export async function approveLeave(id: string, reviewedBy?: string) {
  const leave = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!leave) throw new AppError('Leave request not found', 404);

  const startDate = leave.startDate;
  const endDate = leave.endDate;
  const leaveDays = calculateLeaveDays(startDate, endDate);
  const leaveType = leave.leaveType.toLowerCase();
  const year = startDate.getFullYear();

  // Update leave balance
  const updateData: Record<string, number> = {};
  updateData[`${leaveType}Used`] = { increment: leaveDays };

  await prisma.leaveBalance.upsert({
    where: { employeeId_year: { employeeId: leave.employeeId, year } },
    create: {
      employeeId: leave.employeeId,
      year,
      casualUsed: leaveType === 'casual' ? leaveDays : 0,
      sickUsed: leaveType === 'sick' ? leaveDays : 0,
      paidUsed: leaveType === 'paid' ? leaveDays : 0,
      unpaidUsed: leaveType === 'unpaid' ? leaveDays : 0,
    },
    update: updateData,
  });

  return prisma.leaveRequest.update({
    where: { id },
    data: {
      status: 'APPROVED',
      reviewedAt: new Date(),
      reviewedBy: reviewedBy || undefined,
    },
    include: leaveInclude,
  });
}

export async function rejectLeave(id: string, reviewedBy?: string) {
  const leave = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!leave) throw new AppError('Leave request not found', 404);

  return prisma.leaveRequest.update({
    where: { id },
    data: {
      status: 'REJECTED',
      reviewedAt: new Date(),
      reviewedBy: reviewedBy || undefined,
    },
    include: leaveInclude,
  });
}
