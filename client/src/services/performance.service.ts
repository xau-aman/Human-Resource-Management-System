import type { PerformanceReview } from '../types';
import { mockPerformanceReviews } from '../data/performance.data';

const API_BASE = '/api/v1/performance';

// TODO[PERFORMANCE]: Replace with real API calls to /api/v1/performance

/**
 * Calculate performance score.
 * Task Completion = 35%
 * Goal Achievement = 30%
 * Manager Rating = 25%
 * Attendance Consistency = 10%
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
  attendanceRate: number = 1.0
): number {
  // Task Completion Score (35%) - normalize to 0-100
  const taskCompletionScore = Math.min((tasksCompleted / 100) * 100, 100);

  // Goal Achievement Score (30%) - percentage of goals achieved
  const goalAchievementScore = totalGoals > 0 ? (goalsAchieved / totalGoals) * 100 : 0;

  // Manager Rating Score (25%) - convert 0-5 to 0-100
  const managerRatingScore = (managerRating / 5) * 100;

  // Attendance Consistency Score (10%) - convert 0-1 to 0-100
  const attendanceScore = (attendanceRate / 1) * 100;

  // Calculate final score with weights
  const finalScore =
    taskCompletionScore * 0.35 +
    goalAchievementScore * 0.3 +
    managerRatingScore * 0.25 +
    attendanceScore * 0.1;

  return parseFloat(Math.min(100, Math.max(0, finalScore)).toFixed(1));
}

/**
 * Get performance rating based on score
 */
export function getPerformanceRating(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 75) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Improvement';
  return 'Critical';
}

export async function getPerformanceReviews(): Promise<PerformanceReview[]> {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching performance reviews:', error);
    return mockPerformanceReviews;
  }
}

export async function getEmployeePerformance(employeeId: string): Promise<PerformanceReview | undefined> {
  try {
    const response = await fetch(`${API_BASE}/${employeeId}`);
    if (!response.ok) throw new Error('Failed to fetch employee performance');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching employee performance:', error);
    return mockPerformanceReviews.find((r) => r.employeeId === employeeId);
  }
}

export interface TopPerformer extends PerformanceReview {
  rating: string;
}

export async function getTopPerformers(limit: number = 10): Promise<TopPerformer[]> {
  try {
    const response = await fetch(`${API_BASE}/top-performers?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch top performers');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching top performers:', error);
    return mockPerformanceReviews.slice(0, limit).map((r) => ({
      ...r,
      rating: getPerformanceRating(r.overallScore),
    }));
  }
}

export interface PerformanceTrend {
  period: string;
  score: number;
  rating: string;
  tasksCompleted: number;
  goalsAchieved: number;
  managerRating: number;
}

export async function getPerformanceTrend(employeeId: string): Promise<PerformanceTrend[]> {
  try {
    const response = await fetch(`${API_BASE}/trend/${employeeId}`);
    if (!response.ok) throw new Error('Failed to fetch performance trend');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching performance trend:', error);
    return [];
  }
}
