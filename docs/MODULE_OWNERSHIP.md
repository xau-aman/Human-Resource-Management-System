# Module Ownership

This document defines which developer owns each module in WorkZen HRMS.

## Ownership Table

| Module | Owner | Primary Folder | TODO Tag |
|--------|-------|----------------|----------|
| Core Architecture | Tech Lead | `shared/config`, `context/`, `components/ui/` | `CORE` |
| Attendance | Developer 1 | `features/attendance/`, `pages/attendance/`, `services/attendance.service.ts` | `ATTENDANCE` |
| Leave Management | Developer 2 | `features/leave/`, `pages/leave/`, `services/leave.service.ts` | `LEAVE` |
| Performance | Developer 3 | `features/performance/`, `pages/performance/`, `services/performance.service.ts` | `PERFORMANCE` |
| Skills Matrix | Developer 4 | `features/skills/`, `pages/skills/`, `services/skills.service.ts` | `SKILLS` |
| Analytics | Unassigned | `features/analytics/`, `pages/analytics/`, `services/analytics.service.ts` | `ANALYTICS` |
| AI Insights | Tech Lead | `features/ai-insights/`, `pages/ai-insights/`, `services/ai-insights.service.ts` | `AI-INSIGHTS` |

## Rules

1. **Developers should primarily modify their assigned module folder.**
2. Shared code lives in `components/ui/`, `components/shared/`, `types/`, `utils/`, `services/`.
3. Do not modify another developer's module without coordination.
4. All cross-module communication goes through the service layer.

## Finding Your TODOs

Search globally for your TODO tag to find all tasks assigned to you:

```bash
# Find all attendance TODOs
grep -r "TODO\[ATTENDANCE\]" .

# Find all leave TODOs
grep -r "TODO\[LEAVE\]" .

# Find all performance TODOs
grep -r "TODO\[PERFORMANCE\]" .

# Find all skills TODOs
grep -r "TODO\[SKILLS\]" .

# Find all analytics TODOs
grep -r "TODO\[ANALYTICS\]" .

# Find all AI insights TODOs
grep -r "TODO\[AI-INSIGHTS\]" .
```

## Current TODO Summary

| Tag | Count | Description |
|-----|-------|-------------|
| `TODO[ATTENDANCE]` | 2 | Attendance calculation logic, working hours |
| `TODO[LEAVE]` | 3 | Leave balance validation, API integration |
| `TODO[PERFORMANCE]` | 2 | Performance scoring algorithm |
| `TODO[SKILLS]` | 2 | Skill gap analysis |
| `TODO[ANALYTICS]` | 4 | Real analytics calculations |
| `TODO[AI-INSIGHTS]` | 3 | Connect AI/ML engine |
| `TODO[CORE]` | 3 | JWT auth, API integration |
