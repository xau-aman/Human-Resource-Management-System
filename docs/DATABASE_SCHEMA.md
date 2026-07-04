# Database Schema

## Models

### User
Authentication and role management.
- `id`, `email`, `passwordHash`, `role` (ADMIN/HR/MANAGER/EMPLOYEE)

### Department
Organizational units.
- `id`, `name`, `description`

### Employee
Core employee record.
- `id`, `employeeId` (WZ1001), `firstName`, `lastName`, `email`, `phone`
- `designation`, `joiningDate`, `employmentStatus`
- Relations: `department`, `manager`, `user`

### Attendance
Daily attendance records.
- `id`, `employeeId`, `date`, `checkIn`, `checkOut`, `workingHours`, `status`
- Unique constraint: `(employeeId, date)`

### LeaveRequest
Employee leave applications.
- `id`, `employeeId`, `leaveType`, `startDate`, `endDate`, `reason`, `status`

### PerformanceReview
Quarterly performance data.
- `id`, `employeeId`, `reviewPeriod`, `tasksCompleted`, `goalsAchieved`, `totalGoals`
- `managerRating`, `overallScore`, `comments`

### Skill
Skill catalog.
- `id`, `name`, `category`

### EmployeeSkill
Many-to-many: Employee ↔ Skill with proficiency level.
- `id`, `employeeId`, `skillId`, `level` (BEGINNER/INTERMEDIATE/ADVANCED/EXPERT)

### Project
Project tracking.
- `id`, `name`, `description`, `startDate`, `endDate`, `status`

### ProjectAssignment
Many-to-many: Employee ↔ Project with role.
- `id`, `projectId`, `employeeId`, `role`

### WorkforceInsight
AI-generated workforce alerts.
- `id`, `type`, `severity`, `title`, `description`, `employeeIds`, `departmentId`

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

The seed file creates:
- 4 departments (Engineering, Design, Marketing, Human Resources)
- 12 employees with realistic Indian names
- 7 days of attendance records
- 5 leave requests
- 6 performance reviews
- 10 skills with employee assignments
- 1 project with assignments
- 3 workforce insights
