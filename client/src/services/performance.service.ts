import { api } from '../config/api';

export interface PerformanceBreakdown {
  taskCompletionScore: number;
  goalAchievementScore: number;
  managerRatingScore: number;
  attendanceConsistencyScore: number;
  skillGrowthScore: number;
  taskCompletionContribution: number;
  goalAchievementContribution: number;
  managerRatingContribution: number;
  attendanceContribution: number;
  skillGrowthContribution: number;
  finalScore: number;
  rating: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employee: { id: string; firstName: string; lastName: string; employeeId: string; designation: string; department: { name: string } };
  reviewPeriod: string;
  assignedTasks: number;
  tasksCompleted: number;
  assignedGoals: number;
  goalsAchieved: number;
  totalGoals: number;
  managerRating: number;
  overallScore: number;
  rating: string;
  breakdown: PerformanceBreakdown;
  taskCompletionScore?: number;
  goalAchievementScore?: number;
  managerRatingScore?: number;
  attendanceConsistencyScore?: number;
  skillGrowthScore?: number;
}

export interface PerformanceSummary {
  avgScore: number;
  topPerformer: string | null;
  needsAttention: number;
  totalReviews: number;
}

export async function getPerformanceReviews(): Promise<PerformanceReview[]> {
  const res = await api.get<{ data: PerformanceReview[] }>('/performance');
  return res.data;
}

export async function getEmployeePerformance(employeeId: string): Promise<PerformanceReview[] | null> {
  const res = await api.get<{ data: PerformanceReview[] | null }>(`/performance/employee/${employeeId}`);
  return res.data;
}

export async function getPerformanceSummary(): Promise<PerformanceSummary> {
  const res = await api.get<{ data: PerformanceSummary }>('/performance/summary');
  return res.data;
}

export async function getPerformanceTrend(): Promise<{ period: string; averageScore: number }[]> {
  const res = await api.get<{ data: { period: string; averageScore: number }[] }>('/performance/trend');
  return res.data;
}

export async function getTopPerformers(limit = 5): Promise<any[]> {
  const res = await api.get<{ data: any[] }>(`/performance/top-performers?limit=${limit}`);
  return res.data;
}

// Performance rating badge color mapping
export function getRatingColor(rating: string): 'green' | 'blue' | 'yellow' | 'red' | 'gray' {
  switch (rating) {
    case 'EXCEPTIONAL': return 'green';
    case 'STRONG': return 'blue';
    case 'GOOD': return 'yellow';
    case 'NEEDS_IMPROVEMENT': return 'red';
    case 'CRITICAL': return 'red';
    default: return 'gray';
  }
}
