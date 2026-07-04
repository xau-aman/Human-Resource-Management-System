import type { PerformanceReview } from '../types';
import { api } from '../config/api';

export async function getPerformanceReviews(): Promise<PerformanceReview[]> {
  const res = await api.get<{ data: PerformanceReview[] }>('/performance');
  return res.data;
}

export async function getEmployeePerformance(employeeId: string): Promise<PerformanceReview | null> {
  const res = await api.get<{ data: PerformanceReview | null }>(`/performance/${employeeId}`);
  return res.data;
}

export async function getTopPerformers(limit = 5): Promise<any[]> {
  const res = await api.get<{ data: any[] }>(`/performance/top-performers?limit=${limit}`);
  return res.data;
}
