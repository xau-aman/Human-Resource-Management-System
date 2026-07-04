import { mockEmployees } from '../data/employees.data';
import { mockAttendance } from '../data/attendance.data';
import { mockLeaveRequests } from '../data/leave.data';
import { mockPerformanceReviews } from '../data/performance.data';

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  avgPerformance: number;
}

export interface AttendanceChartData {
  day: string;
  present: number;
  absent: number;
  late: number;
}

export interface DepartmentData {
  name: string;
  value: number;
}

export interface PerformanceTrend {
  month: string;
  score: number;
}

// TODO[CORE]: Replace with real API calls to /api/v1/analytics

export function getDashboardStats(): DashboardStats {
  const presentToday = mockAttendance.filter(a => a.status === 'PRESENT').length;
  const onLeave = mockEmployees.filter(e => e.employmentStatus === 'ON_LEAVE').length;
  const avgPerformance = mockPerformanceReviews.reduce((sum, r) => sum + r.overallScore, 0) / mockPerformanceReviews.length;
  return {
    totalEmployees: mockEmployees.length,
    presentToday,
    onLeave,
    avgPerformance: parseFloat(avgPerformance.toFixed(1)),
  };
}

export function getAttendanceChartData(): AttendanceChartData[] {
  return [
    { day: 'Mon', present: 10, absent: 1, late: 1 },
    { day: 'Tue', present: 11, absent: 0, late: 1 },
    { day: 'Wed', present: 9, absent: 2, late: 1 },
    { day: 'Thu', present: 10, absent: 1, late: 1 },
    { day: 'Fri', present: 8, absent: 2, late: 2 },
  ];
}

export function getDepartmentDistribution(): DepartmentData[] {
  const counts: Record<string, number> = {};
  mockEmployees.forEach(e => { counts[e.department.name] = (counts[e.department.name] || 0) + 1; });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function getPerformanceTrend(): PerformanceTrend[] {
  return [
    { month: 'Jul', score: 72 },
    { month: 'Aug', score: 75 },
    { month: 'Sep', score: 74 },
    { month: 'Oct', score: 78 },
    { month: 'Nov', score: 80 },
    { month: 'Dec', score: 82 },
  ];
}

export function getRecentActivity() {
  return [
    { id: '1', type: 'leave_approved', message: 'Priya Patel\'s sick leave was approved', time: '2 hours ago' },
    { id: '2', type: 'employee_joined', message: 'New employee Meera Krishnan joined Marketing', time: '1 day ago' },
    { id: '3', type: 'performance_review', message: 'Q4 performance reviews completed for Engineering', time: '2 days ago' },
    { id: '4', type: 'leave_request', message: 'Rahul Verma submitted a leave request', time: '3 days ago' },
  ];
}

export function getUpcomingLeaves() {
  return mockLeaveRequests.filter(l => l.status === 'PENDING').slice(0, 4);
}
