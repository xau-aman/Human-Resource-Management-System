import type { LeaveRequest } from '../types';

export const mockLeaveRequests: LeaveRequest[] = [
  { id: 'l1', employeeId: '2', employee: { id: '2', firstName: 'Priya', lastName: 'Patel', employeeId: 'WZ1002', department: { id: 'd1', name: 'Engineering' } }, leaveType: 'SICK', startDate: '2024-12-20', endDate: '2024-12-22', reason: 'Fever and cold', status: 'APPROVED', createdAt: '2024-12-18T10:00:00Z' },
  { id: 'l2', employeeId: '5', employee: { id: '5', firstName: 'Vikram', lastName: 'Nair', employeeId: 'WZ1005', department: { id: 'd1', name: 'Engineering' } }, leaveType: 'CASUAL', startDate: '2024-12-23', endDate: '2024-12-24', reason: 'Family function', status: 'PENDING', createdAt: '2024-12-19T09:00:00Z' },
  { id: 'l3', employeeId: '3', employee: { id: '3', firstName: 'Rahul', lastName: 'Verma', employeeId: 'WZ1003', department: { id: 'd1', name: 'Engineering' } }, leaveType: 'PAID', startDate: '2025-01-02', endDate: '2025-01-05', reason: 'Vacation trip', status: 'PENDING', createdAt: '2024-12-20T11:00:00Z' },
  { id: 'l4', employeeId: '7', employee: { id: '7', firstName: 'Karan', lastName: 'Mehta', employeeId: 'WZ1007', department: { id: 'd2', name: 'Design' } }, leaveType: 'CASUAL', startDate: '2024-12-26', endDate: '2024-12-26', reason: 'Personal work', status: 'APPROVED', createdAt: '2024-12-19T14:00:00Z' },
  { id: 'l5', employeeId: '9', employee: { id: '9', firstName: 'Rohan', lastName: 'Gupta', employeeId: 'WZ1009', department: { id: 'd3', name: 'Marketing' } }, leaveType: 'UNPAID', startDate: '2024-12-27', endDate: '2024-12-28', reason: 'Extended travel', status: 'REJECTED', createdAt: '2024-12-18T16:00:00Z' },
];
