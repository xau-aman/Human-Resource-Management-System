// Performance Scoring Engine for WorkZen HRMS
// Deterministic, explainable, data-driven performance evaluation

// Configurable performance weights (must sum to 1.0)
export const PERFORMANCE_WEIGHTS = {
  taskCompletion: 0.30,
  goalAchievement: 0.25,
  managerRating: 0.20,
  attendanceConsistency: 0.15,
  skillGrowth: 0.10,
};

export type PerformanceRatingType = 'EXCEPTIONAL' | 'STRONG' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL';

export interface PerformanceInput {
  assignedTasks: number;
  completedTasks: number;
  assignedGoals: number;
  achievedGoals: number;
  managerRating: number; // 1-5 scale
  attendanceConsistencyScore: number; // 0-100
  skillGrowthScore: number; // 0-100
}

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
  rating: PerformanceRatingType;
}

// Normalize task completion to 0-100
export function normalizeTaskCompletion(completed: number, assigned: number): number {
  if (assigned === 0) return 75; // Neutral default when no tasks assigned
  return parseFloat((Math.min(completed / assigned, 1.5) * 100 / 1.5).toFixed(1)); // Cap at 150% → 100
}

// Normalize goal achievement to 0-100
export function normalizeGoalAchievement(achieved: number, assigned: number): number {
  if (assigned === 0) return 75; // Neutral default
  return parseFloat((Math.min(achieved / assigned, 1) * 100).toFixed(1));
}

// Normalize manager rating (1-5) to 0-100
export function normalizeManagerRating(rating: number): number {
  const clamped = Math.max(0, Math.min(5, rating));
  return parseFloat(((clamped / 5) * 100).toFixed(1));
}

// Calculate full performance score with breakdown
export function calculatePerformanceScore(input: PerformanceInput): PerformanceBreakdown {
  const taskCompletionScore = normalizeTaskCompletion(input.completedTasks, input.assignedTasks);
  const goalAchievementScore = normalizeGoalAchievement(input.achievedGoals, input.assignedGoals);
  const managerRatingScore = normalizeManagerRating(input.managerRating);
  const attendanceConsistencyScore = Math.max(0, Math.min(100, input.attendanceConsistencyScore));
  const skillGrowthScore = Math.max(0, Math.min(100, input.skillGrowthScore));

  const taskCompletionContribution = parseFloat((taskCompletionScore * PERFORMANCE_WEIGHTS.taskCompletion).toFixed(2));
  const goalAchievementContribution = parseFloat((goalAchievementScore * PERFORMANCE_WEIGHTS.goalAchievement).toFixed(2));
  const managerRatingContribution = parseFloat((managerRatingScore * PERFORMANCE_WEIGHTS.managerRating).toFixed(2));
  const attendanceContribution = parseFloat((attendanceConsistencyScore * PERFORMANCE_WEIGHTS.attendanceConsistency).toFixed(2));
  const skillGrowthContribution = parseFloat((skillGrowthScore * PERFORMANCE_WEIGHTS.skillGrowth).toFixed(2));

  const finalScore = parseFloat((
    taskCompletionContribution +
    goalAchievementContribution +
    managerRatingContribution +
    attendanceContribution +
    skillGrowthContribution
  ).toFixed(2));

  const rating = getPerformanceRating(finalScore);

  return {
    taskCompletionScore, goalAchievementScore, managerRatingScore,
    attendanceConsistencyScore, skillGrowthScore,
    taskCompletionContribution, goalAchievementContribution,
    managerRatingContribution, attendanceContribution, skillGrowthContribution,
    finalScore, rating,
  };
}

// Get performance rating from score
export function getPerformanceRating(score: number): PerformanceRatingType {
  if (score >= 90) return 'EXCEPTIONAL';
  if (score >= 75) return 'STRONG';
  if (score >= 60) return 'GOOD';
  if (score >= 40) return 'NEEDS_IMPROVEMENT';
  return 'CRITICAL';
}

// Performance bonus recommendation
export const BONUS_MULTIPLIERS: Record<PerformanceRatingType, number> = {
  EXCEPTIONAL: 1.0,
  STRONG: 0.8,
  GOOD: 0.5,
  NEEDS_IMPROVEMENT: 0.2,
  CRITICAL: 0,
};

export interface BonusRecommendation {
  eligibleAmount: number;
  rating: PerformanceRatingType;
  multiplier: number;
  recommendedBonus: number;
}

export function calculatePerformanceBonusRecommendation(
  performanceBonusEligibility: number,
  rating: PerformanceRatingType
): BonusRecommendation {
  const multiplier = BONUS_MULTIPLIERS[rating];
  return {
    eligibleAmount: performanceBonusEligibility,
    rating,
    multiplier,
    recommendedBonus: Math.round(performanceBonusEligibility * multiplier),
  };
}
