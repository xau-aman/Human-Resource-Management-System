import type { WorkforceInsight } from '../types';

export const mockInsights: WorkforceInsight[] = [
  { id: 'i1', type: 'WORKLOAD_RISK', severity: 'HIGH', title: 'Engineering team overloaded', description: 'Engineering team has 40% more tasks than capacity this sprint. Consider redistributing work or delaying non-critical features.', employeeIds: ['1', '2'], departmentId: 'd1', createdAt: '2024-12-20T08:00:00Z' },
  { id: 'i2', type: 'SKILL_GAP', severity: 'MEDIUM', title: 'Cloud skills gap detected', description: 'Only 1 of 5 engineers has AWS expertise. 3 upcoming projects require cloud deployment skills.', employeeIds: [], departmentId: 'd1', createdAt: '2024-12-19T10:00:00Z' },
  { id: 'i3', type: 'ATTENDANCE_RISK', severity: 'MEDIUM', title: 'Attendance dip in Marketing', description: 'Marketing department attendance dropped 15% this month compared to last month.', employeeIds: ['9'], departmentId: 'd3', createdAt: '2024-12-18T09:00:00Z' },
  { id: 'i4', type: 'PERFORMANCE_OPPORTUNITY', severity: 'LOW', title: 'High performer ready for promotion', description: 'Ananya Reddy has consistently scored above 90% for 3 consecutive quarters. Consider promotion or expanded responsibilities.', employeeIds: ['6'], departmentId: 'd2', createdAt: '2024-12-17T11:00:00Z' },
];
