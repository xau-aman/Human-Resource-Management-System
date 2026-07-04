import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

/**
 * Performance scoring algorithm
 * Task Completion = 35%
 * Goal Achievement = 30%
 * Manager Rating = 25%
 * Attendance Consistency = 10%
 */
export function calculatePerformanceScore(
  tasksCompleted: number,
  goalsAchieved: number,
  totalGoals: number,
  managerRating: number,
  attendanceRate: number
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

/**
 * Get performance color based on rating
 */
export function getPerformanceColor(rating: string): string {
  const colorMap: Record<string, string> = {
    Exceptional: '#10b981',
    Strong: '#3b82f6',
    Good: '#f59e0b',
    'Needs Improvement': '#ef4444',
    Critical: '#dc2626',
  };
  return colorMap[rating] || '#6b7280';
}

export async function getPerformanceReviews() {
  const reviews = await prisma.performanceReview.findMany({
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          designation: true,
          department: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return reviews.map((review) => ({
    ...review,
    rating: getPerformanceRating(review.overallScore),
    color: getPerformanceColor(getPerformanceRating(review.overallScore)),
  }));
}

export async function getEmployeePerformance(employeeId: string) {
  const review = await prisma.performanceReview.findFirst({
    where: { employeeId },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          designation: true,
          department: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!review) return null;

  return {
    ...review,
    rating: getPerformanceRating(review.overallScore),
    color: getPerformanceColor(getPerformanceRating(review.overallScore)),
  };
}

/**
 * Get top performers
 */
export async function getTopPerformers(limit: number = 10) {
  const reviews = await prisma.performanceReview.findMany({
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          designation: true,
          department: { select: { name: true } },
        },
      },
    },
    orderBy: { overallScore: 'desc' },
    take: limit,
  });

  return reviews.map((review) => ({
    ...review,
    rating: getPerformanceRating(review.overallScore),
    color: getPerformanceColor(getPerformanceRating(review.overallScore)),
  }));
}

/**
 * Get performance trend for an employee
 */
export async function getPerformanceTrend(employeeId: string) {
  const reviews = await prisma.performanceReview.findMany({
    where: { employeeId },
    orderBy: { createdAt: 'asc' },
    take: 12, // Get last 12 reviews
  });

  return reviews.map((review) => ({
    period: review.reviewPeriod,
    score: review.overallScore,
    rating: getPerformanceRating(review.overallScore),
    tasksCompleted: review.tasksCompleted,
    goalsAchieved: review.goalsAchieved,
    managerRating: review.managerRating,
  }));
}

/**
 * Create or update performance review with calculated score
 */
export async function createPerformanceReview(data: {
  employeeId: string;
  reviewPeriod: string;
  tasksCompleted: number;
  goalsAchieved: number;
  totalGoals: number;
  managerRating: number;
  attendanceRate?: number;
  comments?: string;
  reviewedBy?: string;
}) {
  // Check if employee exists and is active
  const employee = await prisma.employee.findUnique({
    where: { id: data.employeeId },
  });

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  if (employee.employmentStatus !== 'ACTIVE') {
    throw new AppError('Can only create reviews for active employees', 400);
  }

  // Calculate score
  const attendanceRate = data.attendanceRate ?? 1.0;
  const overallScore = calculatePerformanceScore(
    data.tasksCompleted,
    data.goalsAchieved,
    data.totalGoals,
    data.managerRating,
    attendanceRate
  );

  const review = await prisma.performanceReview.create({
    data: {
      employeeId: data.employeeId,
      reviewPeriod: data.reviewPeriod,
      tasksCompleted: data.tasksCompleted,
      goalsAchieved: data.goalsAchieved,
      totalGoals: data.totalGoals,
      managerRating: data.managerRating,
      overallScore,
      comments: data.comments,
      reviewedBy: data.reviewedBy,
    },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeId: true,
          designation: true,
          department: { select: { name: true } },
        },
      },
    },
  });

  return {
    ...review,
    rating: getPerformanceRating(overallScore),
    color: getPerformanceColor(getPerformanceRating(overallScore)),
  };
}
