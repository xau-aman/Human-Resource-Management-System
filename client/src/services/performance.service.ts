import type { PerformanceReview } from '../types';
import { mockPerformanceReviews } from '../data/performance.data';

// TODO[PERFORMANCE]: Replace with real API calls to /api/v1/performance

/**
 * Calculate performance score.
 * TODO[PERFORMANCE]: Implement performance scoring
 * @param tasksCompleted - number of tasks completed
 * @param goalsAchieved - number of goals achieved
 * @param totalGoals - total goals set
 * @param managerRating - manager rating (0-5)
 * @param attendanceRate - attendance rate (0-1)
 * @returns score (0-100)
 */
export function calculatePerformanceScore(
  tasksCompleted: number,
  goalsAchieved: number,
  totalGoals: number,
  managerRating: number,
  _attendanceRate: number
): number {
  // Temporary mock - replace with real algorithm
  const goalRate = totalGoals > 0 ? (goalsAchieved / totalGoals) : 0;
  return parseFloat(((goalRate * 40 + (managerRating / 5) * 40 + Math.min(tasksCompleted / 30, 1) * 20)).toFixed(1));
}

export async function getPerformanceReviews(): Promise<PerformanceReview[]> {
  return mockPerformanceReviews;
}

export async function getEmployeePerformance(employeeId: string): Promise<PerformanceReview | undefined> {
  return mockPerformanceReviews.find(r => r.employeeId === employeeId);
}
