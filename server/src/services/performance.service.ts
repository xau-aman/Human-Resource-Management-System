import prisma from '../config/prisma';

const attendanceConsistencyStatuses = new Set(['PRESENT', 'LATE', 'HALF_DAY']);

async function getAttendanceConsistency(employeeId: string): Promise<number> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      employeeId,
      date: { gte: startDate },
    },
    select: { status: true },
  });

  if (attendanceRecords.length === 0) {
    return 0.9;
  }

  const presentDays = attendanceRecords.filter((record) => attendanceConsistencyStatuses.has(record.status)).length;
  return Number((presentDays / attendanceRecords.length).toFixed(2));
}

export function calculatePerformanceScore(
  tasksCompleted: number,
  goalsAchieved: number,
  totalGoals: number,
  managerRating: number,
  attendanceRate: number
): number {
  const taskCompletionScore = totalGoals > 0 ? (Math.min(tasksCompleted, totalGoals) / totalGoals) * 100 : 0;
  const goalAchievementScore = totalGoals > 0 ? (goalsAchieved / totalGoals) * 100 : 0;
  const managerRatingScore = Math.max(0, Math.min(5, managerRating)) / 5 * 100;
  const attendanceConsistencyScore = Math.max(0, Math.min(1, attendanceRate)) * 100;

  const score = taskCompletionScore * 0.35 + goalAchievementScore * 0.3 + managerRatingScore * 0.25 + attendanceConsistencyScore * 0.1;
  return parseFloat(Math.min(100, Math.max(0, score)).toFixed(1));
}

export function getPerformanceRating(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 75) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Improvement';
  return 'Critical';
}

export async function getPerformanceReviews() {
  const reviews = await prisma.performanceReview.findMany({
    include: { employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, designation: true, department: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  return Promise.all(
    reviews.map(async (review) => {
      const attendanceRate = await getAttendanceConsistency(review.employeeId);
      const score = calculatePerformanceScore(review.tasksCompleted, review.goalsAchieved, review.totalGoals, review.managerRating, attendanceRate);
      return {
        ...review,
        attendanceRate,
        score,
        rating: getPerformanceRating(score),
      };
    })
  );
}

export async function getEmployeePerformance(employeeId: string) {
  const review = await prisma.performanceReview.findFirst({
    where: { employeeId },
    include: { employee: { select: { id: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: 'desc' },
  });

  if (!review) {
    return null;
  }

  const attendanceRate = await getAttendanceConsistency(employeeId);
  const score = calculatePerformanceScore(review.tasksCompleted, review.goalsAchieved, review.totalGoals, review.managerRating, attendanceRate);

  return {
    ...review,
    attendanceRate,
    score,
    rating: getPerformanceRating(score),
  };
}

export async function getTopPerformers(limit = 5) {
  const reviews = await getPerformanceReviews();
  return reviews
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((review) => ({
      employeeId: review.employeeId,
      employeeName: `${review.employee.firstName} ${review.employee.lastName}`,
      employeeIdValue: review.employee.employeeId,
      designation: review.employee.designation,
      department: review.employee.department?.name ?? 'N/A',
      score: review.score,
      rating: review.rating,
    }));
}

export async function getPerformanceTrend(limit = 6) {
  const reviews = await prisma.performanceReview.findMany({
    orderBy: { createdAt: 'asc' },
    select: { employeeId: true, reviewPeriod: true, tasksCompleted: true, goalsAchieved: true, totalGoals: true, managerRating: true, createdAt: true },
  });

  const trendMap = new Map<string, { period: string; scoreSum: number; reviewCount: number }>();

  for (const review of reviews) {
    const attendanceRate = await getAttendanceConsistency(review.employeeId);
    const score = calculatePerformanceScore(review.tasksCompleted, review.goalsAchieved, review.totalGoals, review.managerRating, attendanceRate);
    const period = review.reviewPeriod || review.createdAt.toISOString().slice(0, 7);
    const current = trendMap.get(period) ?? { period, scoreSum: 0, reviewCount: 0 };
    current.scoreSum += score;
    current.reviewCount += 1;
    trendMap.set(period, current);
  }

  return Array.from(trendMap.values())
    .map((entry) => ({
      period: entry.period,
      averageScore: parseFloat((entry.scoreSum / entry.reviewCount).toFixed(1)),
    }))
    .sort((left, right) => left.period.localeCompare(right.period))
    .slice(-limit);
}
