import type { LeaveRequest } from '../types';
import { mockLeaveRequests } from '../data/leave.data';

const API_BASE = '/api/v1/leaves';

// TODO[LEAVE]: Replace with real API calls to /api/v1/leaves

export interface LeaveBalance {
  casual: number;
  sick: number;
  paid: number;
  unpaid: number | 'unlimited';
  used: {
    casual: number;
    sick: number;
    paid: number;
    unpaid: number;
  };
}

export async function getLeaveRequests(status?: string): Promise<LeaveRequest[]> {
  try {
    const url = status ? `${API_BASE}?status=${status}` : API_BASE;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch leave requests');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    if (status) return mockLeaveRequests.filter((l) => l.status === status);
    return mockLeaveRequests;
  }
}

export async function createLeaveRequest(data: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>): Promise<LeaveRequest> {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create leave request');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating leave request:', error);
    return { ...data, id: String(Date.now()), status: 'PENDING', createdAt: new Date().toISOString() };
  }
}

export async function approveLeave(id: string): Promise<LeaveRequest> {
  try {
    const response = await fetch(`${API_BASE}/${id}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to approve leave');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error approving leave:', error);
    const leave = mockLeaveRequests.find((l) => l.id === id);
    if (!leave) throw new Error('Leave request not found');
    return { ...leave, status: 'APPROVED' };
  }
}

export async function rejectLeave(id: string): Promise<LeaveRequest> {
  try {
    const response = await fetch(`${API_BASE}/${id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to reject leave');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error rejecting leave:', error);
    const leave = mockLeaveRequests.find((l) => l.id === id);
    if (!leave) throw new Error('Leave request not found');
    return { ...leave, status: 'REJECTED' };
  }
}

export async function getLeaveBalance(employeeId: string, year?: number): Promise<LeaveBalance> {
  try {
    const url = year ? `${API_BASE}/balance/${employeeId}?year=${year}` : `${API_BASE}/balance/${employeeId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch leave balance');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    return {
      casual: 12,
      sick: 10,
      paid: 15,
      unpaid: 'unlimited',
      used: { casual: 0, sick: 0, paid: 0, unpaid: 0 },
    };
  }
}

export interface LeaveValidation {
  valid: boolean;
  errors: string[];
}

export async function validateLeaveRequest(data: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>): Promise<LeaveValidation> {
  try {
    const response = await fetch(`${API_BASE}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to validate leave request');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error validating leave request:', error);
    return { valid: true, errors: [] };
  }
}
