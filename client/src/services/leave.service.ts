import type { LeaveRequest } from '../types';
import { mockLeaveRequests } from '../data/leave.data';

// TODO[LEAVE]: Replace with real API calls to /api/v1/leaves

export async function getLeaveRequests(status?: string): Promise<LeaveRequest[]> {
  if (status) return mockLeaveRequests.filter(l => l.status === status);
  return mockLeaveRequests;
}

export async function createLeaveRequest(data: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>): Promise<LeaveRequest> {
  // TODO[LEAVE]: Add leave balance validation
  // TODO[LEAVE]: POST /api/v1/leaves
  return { ...data, id: String(Date.now()), status: 'PENDING', createdAt: new Date().toISOString() };
}

export async function approveLeave(id: string): Promise<LeaveRequest> {
  // TODO[LEAVE]: PATCH /api/v1/leaves/:id/approve
  const leave = mockLeaveRequests.find(l => l.id === id);
  if (!leave) throw new Error('Leave request not found');
  return { ...leave, status: 'APPROVED' };
}

export async function rejectLeave(id: string): Promise<LeaveRequest> {
  // TODO[LEAVE]: PATCH /api/v1/leaves/:id/reject
  const leave = mockLeaveRequests.find(l => l.id === id);
  if (!leave) throw new Error('Leave request not found');
  return { ...leave, status: 'REJECTED' };
}
