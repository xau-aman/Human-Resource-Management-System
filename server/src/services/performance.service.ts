import prisma from '../config/prisma';

/**
 * Calculate performance score for an employee.
 * TODO[PERFORMANCE]: Implement performance scoring
 * Inputs: tasksCompleted, goalsAchieved, totalGoals, managerRating (0-5), attendanceRate (0-1)
 * Output: number (0-100)
 */
export function calculatePerformanceScore(
  tasksCompleted: number,
  goalsAchieved: number,
  totalGoals: number,
  managerRating: number,
  _attendanceRate: number
): number {
  const goalRate = totalGoals > 0 ? (goalsAchieved / totalGoals) * 100 : 0;
  const ratingScore = (managerRating / 5) * 100;
  return parseFloat(((goalRate * 0.5 + ratingScore * 0.3 + Math.min(tasksCompleted, 30) * 0.7) / 1.3).toFixed(1));
}

export async function getPerformanceReviews() {
  return prisma.performanceReview.findMany({
    include: { employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, designation: true, department: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getEmployeePerformance(employeeId: string) {
  return prisma.performanceReview.findFirst({
    where: { employeeId },
    include: { employee: { select: { id: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: 'desc' },
  });
}
