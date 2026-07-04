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

const leaveInclude = {
  employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, department: { select: { name: true } } } },
};

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
  // TODO[LEAVE]: Add leave balance validation
  return prisma.leaveRequest.create({
    data: {
      employeeId: data.employeeId,
      leaveType: data.leaveType,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      reason: data.reason,
    },
    include: leaveInclude,
  });
}

export async function approveLeave(id: string) {
  const leave = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!leave) throw new AppError('Leave request not found', 404);
  return prisma.leaveRequest.update({ where: { id }, data: { status: 'APPROVED', reviewedAt: new Date() }, include: leaveInclude });
}

export async function rejectLeave(id: string) {
  const leave = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!leave) throw new AppError('Leave request not found', 404);
  return prisma.leaveRequest.update({ where: { id }, data: { status: 'REJECTED', reviewedAt: new Date() }, include: leaveInclude });
}
