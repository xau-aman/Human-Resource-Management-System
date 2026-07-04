# Performance Scoring Engine

## Overview

WorkZen HRMS uses a **weighted, deterministic, explainable** performance scoring system. Every employee's performance score is calculated from measurable workforce signals, and the breakdown is fully transparent.

## Scoring Weights

| Factor | Weight | Description |
|--------|--------|-------------|
| Task Completion | 30% | Ratio of completed tasks to assigned tasks |
| Goal Achievement | 25% | Ratio of achieved goals to assigned goals |
| Manager Rating | 20% | Manager's 1-5 rating normalized to 0-100 |
| Attendance Consistency | 15% | Derived from attendance records (last 30 days) |
| Skill Growth | 10% | Skill development score per review period |

**Total: 100%**

## Formula

```
finalScore = 
  (taskCompletionScore × 0.30) +
  (goalAchievementScore × 0.25) +
  (managerRatingScore × 0.20) +
  (attendanceConsistencyScore × 0.15) +
  (skillGrowthScore × 0.10)
```

## Input Normalization (0-100 scale)

### Task Completion
```
score = min(completedTasks / assignedTasks, 1.5) × 100 / 1.5
```
- Capped at 150% to prevent gaming
- If assignedTasks = 0: returns 75 (neutral)

### Goal Achievement
```
score = min(achievedGoals / assignedGoals, 1) × 100
```
- If assignedGoals = 0: returns 75 (neutral)

### Manager Rating
```
score = (rating / 5) × 100
```
- Rating clamped to 0-5 range

### Attendance Consistency
```
For each attendance record:
  PRESENT → 1.0 point
  LATE → 0.85 point
  HALF_DAY → 0.5 point
  ABSENT → 0 point

score = (totalPoints / totalRecords) × 100
```
- Approved paid leave is excluded from calculation (not penalized)
- If no records: returns 90 (neutral default)

### Skill Growth
```
score = stored skillGrowthScore from review (0-100)
```
- Currently set during review creation
- TODO: Derive from historical skill level progression

## Performance Ratings

| Score Range | Rating | Badge Color |
|-------------|--------|-------------|
| 90-100 | EXCEPTIONAL | Green |
| 75-89.99 | STRONG | Blue |
| 60-74.99 | GOOD | Yellow |
| 40-59.99 | NEEDS_IMPROVEMENT | Red |
| Below 40 | CRITICAL | Red |

## Example Calculation

```
Employee: Priya Patel
Monthly Wage: ₹120,000

Task Completion: 28/35 = 80% → Score: 80
Goal Achievement: 4/5 = 80% → Score: 80
Manager Rating: 4.2/5 = 84% → Score: 84
Attendance: 85% consistency → Score: 85
Skill Growth: 75 → Score: 75

Final Score:
  (80 × 0.30) = 24.00
+ (80 × 0.25) = 20.00
+ (84 × 0.20) = 16.80
+ (85 × 0.15) = 12.75
+ (75 × 0.10) = 7.50
= 81.05

Rating: STRONG
```

## Performance Bonus Recommendation

Performance rating influences bonus eligibility:

| Rating | Bonus Multiplier |
|--------|-----------------|
| EXCEPTIONAL | 100% of eligible amount |
| STRONG | 80% |
| GOOD | 50% |
| NEEDS_IMPROVEMENT | 20% |
| CRITICAL | 0% |

```
Eligible Performance Bonus = 8.33% of monthly wage
Recommended Bonus = eligibleAmount × multiplier
```

**Note:** This is a recommendation only. Requires HR approval before disbursement.

## Configuration

Weights are defined in `server/src/utils/performance.ts`:
```typescript
export const PERFORMANCE_WEIGHTS = {
  taskCompletion: 0.30,
  goalAchievement: 0.25,
  managerRating: 0.20,
  attendanceConsistency: 0.15,
  skillGrowth: 0.10,
};
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/performance` | All reviews with calculated scores |
| GET | `/performance/summary` | Org-wide summary stats |
| GET | `/performance/trend` | Score trend over review periods |
| GET | `/performance/top-performers` | Top N performers |
| GET | `/performance/employee/:id` | Employee's review history |
