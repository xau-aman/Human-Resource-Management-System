import { api } from '../config/api';

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  avgPerformance: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await api.get<{ data: { totalEmployees: number; activeEmployees: number; onLeave: number; departments: any[] } }>('/analytics/overview');
  const summary = await api.get<{ data: { present: number; absent: number; late: number; total: number } }>('/attendance/summary');
  return {
    totalEmployees: res.data.totalEmployees,
    presentToday: summary.data.present,
    onLeave: res.data.onLeave,
    avgPerformance: 0,
  };
}

export async function getAttendanceChartData(): Promise<{ day: string; present: number; absent: number; late: number }[]> {
  const res = await api.get<{ data: { date: string; present: number; absent: number; late: number }[] }>('/analytics/attendance-trend?days=5');
  return res.data.map(d => ({ day: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }), present: d.present, absent: d.absent, late: d.late }));
}

export async function getDepartmentDistribution(): Promise<{ name: string; value: number }[]> {
  const res = await api.get<{ data: { totalEmployees: number; departments: { name: string; _count: { employees: number } }[] } }>('/analytics/overview');
  return res.data.departments.map((d: any) => ({ name: d.name, value: d._count?.employees ?? 0 }));
}

export async function getPerformanceTrend(): Promise<{ month: string; score: number }[]> {
  const res = await api.get<{ data: { department: string; avgScore: number }[] }>('/analytics/department-performance');
  return res.data.map(d => ({ month: d.department.slice(0, 3), score: d.avgScore }));
}

export function getRecentActivity() {
  return [
    { id: '1', type: 'leave_approved', message: 'Leave request approved for Priya Patel', time: '2 hours ago' },
    { id: '2', type: 'employee_joined', message: 'New employee Meera Krishnan joined Marketing', time: '1 day ago' },
    { id: '3', type: 'performance_review', message: 'Q4 performance reviews completed', time: '2 days ago' },
    { id: '4', type: 'leave_request', message: 'Rahul Verma submitted a leave request', time: '3 days ago' },
  ];
}

export async function getUpcomingLeaves(): Promise<any[]> {
  const res = await api.get<{ data: any[] }>('/leaves?status=PENDING');
  return res.data.slice(0, 4);
}
