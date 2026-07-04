import prisma from '../config/prisma';
import { calculatePerformanceScore, getPerformanceRating, calculatePerformanceBonusRecommendation, BONUS_MULTIPLIERS, type PerformanceRatingType } from '../utils/performance';
import { calculateAttendanceConsistency } from '../utils/attendance';

async function getAttendanceConsistencyForEmployee(employeeId: string): Promise<number> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const records = await prisma.attendance.findMany({
    where: { employeeId, date: { gte: startDate } },
    select: { status: true },
  });
  return calculateAttendanceConsistency(records);
}

export async function getPerformanceReviews() {
  const reviews = await prisma.performanceReview.findMany({
    include: { employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, designation: true, department: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  return Promise.all(reviews.map(async (review) => {
    const attendanceScore = review.attendanceConsistencyScore ?? await getAttendanceConsistencyForEmployee(review.employeeId);
    const skillGrowth = review.skillGrowthScore ?? 70; // Default if not set

    const breakdown = calculatePerformanceScore({
      assignedTasks: review.assignedTasks || review.totalGoals || 1,
      completedTasks: review.tasksCompleted,
      assignedGoals: review.assignedGoals || review.totalGoals || 1,
      achievedGoals: review.goalsAchieved,
      managerRating: review.managerRating,
      attendanceConsistencyScore: attendanceScore,
      skillGrowthScore: skillGrowth,
    });

    return {
      ...review,
      taskCompletionScore: breakdown.taskCompletionScore,
      goalAchievementScore: breakdown.goalAchievementScore,
      managerRatingScore: breakdown.managerRatingScore,
      attendanceConsistencyScore: attendanceScore,
      skillGrowthScore: skillGrowth,
      overallScore: breakdown.finalScore,
      rating: breakdown.rating,
      breakdown,
    };
  }));
}

export async function getEmployeePerformance(employeeId: string) {
  const reviews = await prisma.performanceReview.findMany({
    where: { employeeId },
    include: { employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, designation: true, department: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  if (reviews.length === 0) return null;

  const attendanceScore = await getAttendanceConsistencyForEmployee(employeeId);

  return Promise.all(reviews.map(async (review) => {
    const skillGrowth = review.skillGrowthScore ?? 70;
    const breakdown = calculatePerformanceScore({
      assignedTasks: review.assignedTasks || review.totalGoals || 1,
      completedTasks: review.tasksCompleted,
      assignedGoals: review.assignedGoals || review.totalGoals || 1,
      achievedGoals: review.goalsAchieved,
      managerRating: review.managerRating,
      attendanceConsistencyScore: attendanceScore,
      skillGrowthScore: skillGrowth,
    });

    return { ...review, overallScore: breakdown.finalScore, rating: breakdown.rating, breakdown };
  }));
}

export async function getTopPerformers(limit = 5) {
  const reviews = await getPerformanceReviews();
  return reviews
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, limit)
    .map(r => ({
      employeeId: r.employeeId,
      employeeName: `${r.employee.firstName} ${r.employee.lastName}`,
      employeeIdValue: r.employee.employeeId,
      designation: r.employee.designation,
      department: r.employee.department?.name ?? 'N/A',
      score: r.overallScore,
      rating: r.rating,
    }));
}

export async function getPerformanceSummary() {
  const reviews = await getPerformanceReviews();
  if (reviews.length === 0) return { avgScore: 0, topPerformer: null, needsAttention: 0, totalReviews: 0 };

  const avgScore = parseFloat((reviews.reduce((s, r) => s + r.overallScore, 0) / reviews.length).toFixed(1));
  const sorted = [...reviews].sort((a, b) => b.overallScore - a.overallScore);
  const topPerformer = sorted[0] ? `${sorted[0].employee.firstName} ${sorted[0].employee.lastName}` : null;
  const needsAttention = reviews.filter(r => r.overallScore < 60).length;

  return { avgScore, topPerformer, needsAttention, totalReviews: reviews.length };
}

export async function getPerformanceTrend(limit = 6) {
  const reviews = await prisma.performanceReview.findMany({
    orderBy: { createdAt: 'asc' },
    select: { employeeId: true, reviewPeriod: true, tasksCompleted: true, goalsAchieved: true, totalGoals: true, assignedTasks: true, assignedGoals: true, managerRating: true, attendanceConsistencyScore: true, skillGrowthScore: true, createdAt: true },
  });

  const trendMap = new Map<string, { period: string; scoreSum: number; count: number }>();

  for (const review of reviews) {
    const attendanceScore = review.attendanceConsistencyScore ?? 85;
    const skillGrowth = review.skillGrowthScore ?? 70;
    const breakdown = calculatePerformanceScore({
      assignedTasks: review.assignedTasks || review.totalGoals || 1,
      completedTasks: review.tasksCompleted,
      assignedGoals: review.assignedGoals || review.totalGoals || 1,
      achievedGoals: review.goalsAchieved,
      managerRating: review.managerRating,
      attendanceConsistencyScore: attendanceScore,
      skillGrowthScore: skillGrowth,
    });

    const period = review.reviewPeriod || review.createdAt.toISOString().slice(0, 7);
    const current = trendMap.get(period) ?? { period, scoreSum: 0, count: 0 };
    current.scoreSum += breakdown.finalScore;
    current.count += 1;
    trendMap.set(period, current);
  }

  return Array.from(trendMap.values())
    .map(e => ({ period: e.period, averageScore: parseFloat((e.scoreSum / e.count).toFixed(1)) }))
    .sort((a, b) => a.period.localeCompare(b.period))
    .slice(-limit);
}

export { calculatePerformanceBonusRecommendation, getPerformanceRating };
