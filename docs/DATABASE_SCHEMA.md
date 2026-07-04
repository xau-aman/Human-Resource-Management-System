# Database Schema

## Entity Relationship Diagram

```
User (1) ──── (1) Employee (N) ──── (1) Department
                    │
        ┌───────────┼───────────────┐
        │           │               │
  Attendance[]  LeaveRequest[]  PerformanceReview[]
                    │
              LeaveBalance (1:1)
                    │
              EmployeeSkill[] ──── Skill
                    │
          ProjectAssignment[] ──── Project

WorkforceInsight (standalone)
```

## Models

### User
Authentication and role management.

| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id, cuid |
| email | String | @unique |
| passwordHash | String | bcrypt hash |
| role | UserRole | default: EMPLOYEE |
| firebaseUid | String? | @unique, optional |
| employee | Employee? | 1:1 relation |
| createdAt | DateTime | auto |
| updatedAt | DateTime | auto |

### Department
Organizational units.

| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id, cuid |
| name | String | @unique |
| description | String? | — |
| employees | Employee[] | 1:N relation |

### Employee
Core employee record with salary.

| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id, cuid |
| employeeId | String | @unique (WZ1001, WZ1002...) |
| firstName | String | — |
| lastName | String | — |
| email | String | @unique |
| phone | String? | — |
| designation | String | — |
| salary | Float? | default: 0 |
| joiningDate | DateTime | — |
| employmentStatus | EmploymentStatus | default: ACTIVE |
| avatar | String? | — |
| departmentId | String | FK → Department |
| managerId | String? | FK → Employee (self-relation) |
| userId | String? | @unique, FK → User |

**Relations:** department, manager, subordinates[], user, attendance[], leaveRequests[], leaveBalance, performanceReviews[], employeeSkills[], projectAssignments[]

### Attendance
Daily attendance records.

| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id, cuid |
| employeeId | String | FK → Employee |
| date | DateTime | @db.Date |
| checkIn | DateTime? | — |
| checkOut | DateTime? | — |
| status | AttendanceStatus | default: PRESENT |
| workingHours | Float? | calculated on clock-out |
| notes | String? | — |

**Unique constraint:** `@@unique([employeeId, date])`

**Business rules:**
- Clock-in after 10:00 AM → status = LATE
- Clock-out calculates workingHours from checkIn/checkOut difference

### LeaveRequest
Employee leave applications.

| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id, cuid |
| employeeId | String | FK → Employee |
| leaveType | LeaveType | CASUAL/SICK/PAID/UNPAID |
| startDate | DateTime | @db.Date |
| endDate | DateTime | @db.Date |
| reason | String | — |
| status | LeaveStatus | default: PENDING |
| reviewedBy | String? | user ID who approved/rejected |
| reviewedAt | DateTime? | — |

**Business rules:**
- Validates leave balance before creation
- Only ADMIN/HR/MANAGER can approve/reject
- Updates LeaveBalance on approval

### LeaveBalance
Per-employee annual leave tracking.

| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id, cuid |
| employeeId | String | @unique |
| casualUsed | Float | default: 0 |
| sickUsed | Float | default: 0 |
| paidUsed | Float | default: 0 |
| unpaidUsed | Float | default: 0 |
| year | Int | — |

**Unique constraint:** `@@unique([employeeId, year])`

**Leave limits:** Casual: 12, Sick: 10, Paid: 15, Unpaid: unlimited

### PerformanceReview
Quarterly performance data.

| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id, cuid |
| employeeId | String | FK → Employee |
| reviewPeriod | String | e.g., "Q4 2024" |
| tasksCompleted | Int | default: 0 |
| goalsAchieved | Int | default: 0 |
| totalGoals | Int | default: 0 |
| managerRating | Float | 0-5 scale |
| overallScore | Float | calculated (0-100) |
| comments | String? | — |
| reviewedBy | String? | — |

**Score calculation:**
```
overallScore = (goalsAchieved/totalGoals * 40) + (managerRating/5 * 40) + (min(tasksCompleted/30, 1) * 20)
```

### Skill
Skill catalog.

| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id, cuid |
| name | String | @unique |
| category | String | Frontend/Backend/Database/Cloud/Design/Soft Skills/Management |

### EmployeeSkill
Many-to-many with proficiency level.

| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id, cuid |
| employeeId | String | FK → Employee |
| skillId | String | FK → Skill |
| level | SkillLevel | BEGINNER/INTERMEDIATE/ADVANCED/EXPERT |

**Unique constraint:** `@@unique([employeeId, skillId])`

### Project

| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id, cuid |
| name | String | — |
| description | String? | — |
| startDate | DateTime | — |
| endDate | DateTime? | — |
| status | String | default: "ACTIVE" |

### ProjectAssignment

| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id, cuid |
| projectId | String | FK → Project |
| employeeId | String | FK → Employee |
| role | String | e.g., "Tech Lead", "Developer" |

**Unique constraint:** `@@unique([projectId, employeeId])`

### WorkforceInsight
AI-generated workforce alerts.

| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id, cuid |
| type | InsightType | — |
| severity | InsightSeverity | — |
| title | String | — |
| description | String | — |
| employeeIds | String[] | array of employee IDs |
| departmentId | String? | — |
| isResolved | Boolean | default: false |

## Enums

| Enum | Values |
|------|--------|
| UserRole | ADMIN, HR, MANAGER, EMPLOYEE |
| EmploymentStatus | ACTIVE, INACTIVE, ON_LEAVE, TERMINATED |
| AttendanceStatus | PRESENT, ABSENT, LATE, HALF_DAY, HOLIDAY |
| LeaveType | CASUAL, SICK, PAID, UNPAID |
| LeaveStatus | PENDING, APPROVED, REJECTED |
| SkillLevel | BEGINNER, INTERMEDIATE, ADVANCED, EXPERT |
| InsightType | WORKLOAD_RISK, SKILL_GAP, PERFORMANCE_OPPORTUNITY, ATTENDANCE_RISK |
| InsightSeverity | LOW, MEDIUM, HIGH, CRITICAL |

## Seed Data

| Entity | Count | Details |
|--------|-------|---------|
| Departments | 4 | Engineering, Design, Marketing, Human Resources |
| Employees | 12 | Realistic Indian names, salaries ₹70K–₹180K |
| Attendance | ~60 | 7 working days × 12 employees |
| Leave Requests | 4 | Mix of PENDING/APPROVED |
| Performance Reviews | 12 | Q4 2024, all employees |
| Skills | 10 | React, Node.js, Python, TypeScript, PostgreSQL, Leadership, Communication, Project Management, Figma, AWS |
| Projects | 1 | WorkZen Platform v2 |
| Insights | 4 | Various types and severities |

## Migrations

| Migration | Description |
|-----------|-------------|
| `20260704085753_init` | Initial schema with all models |
| `20260704093255_add_salary_field` | Added `salary` field to Employee |
