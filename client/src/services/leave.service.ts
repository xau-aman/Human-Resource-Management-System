import type { LeaveRequest } from '../types';
import { api } from '../config/api';

export async function getLeaveRequests(status?: string): Promise<LeaveRequest[]> {
  const query = status ? `?status=${status}` : '';
  const res = await api.get<{ data: LeaveRequest[] }>(`/leaves${query}`);
  return res.data;
}

export async function getMyLeaves(): Promise<LeaveRequest[]> {
  const res = await api.get<{ data: LeaveRequest[] }>('/leaves/me');
  return res.data;
}

export async function createLeaveRequest(data: { leaveType: string; startDate: string; endDate: string; reason: string }): Promise<LeaveRequest> {
  const res = await api.post<{ data: LeaveRequest }>('/leaves', data);
  return res.data;
}

export async function approveLeave(id: string): Promise<LeaveRequest> {
  const res = await api.patch<{ data: LeaveRequest }>(`/leaves/${id}/approve`);
  return res.data;
}

export async function rejectLeave(id: string): Promise<LeaveRequest> {
  const res = await api.patch<{ data: LeaveRequest }>(`/leaves/${id}/reject`);
  return res.data;
}
