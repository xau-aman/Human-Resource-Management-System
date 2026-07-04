// ─── API ───────────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export type UserRole = 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

// ─── Employee ──────────────────────────────────────────────────────────────
export type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface Department {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: Department;
  designation: string;
  role?: UserRole;
  joiningDate: string;
  employmentStatus: EmploymentStatus;
  managerId?: string;
  avatar?: string;
  skills?: EmployeeSkill[];
}

// ─── Attendance ────────────────────────────────────────────────────────────
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'HOLIDAY';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employee: Pick<Employee, 'id' | 'firstName' | 'lastName' | 'employeeId'> & { department: Department };
  date: string;
  checkIn?: string;
  checkOut?: string;
  workingHours?: number;
  status: AttendanceStatus;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  total: number;
}

// ─── Leave ─────────────────────────────────────────────────────────────────
export type LeaveType = 'CASUAL' | 'SICK' | 'PAID' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee: Pick<Employee, 'id' | 'firstName' | 'lastName' | 'employeeId'> & { department: Department };
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

// ─── Performance ───────────────────────────────────────────────────────────
export interface PerformanceReview {
  id: string;
  employeeId: string;
  employee: Pick<Employee, 'id' | 'firstName' | 'lastName' | 'employeeId' | 'designation'> & { department: Department };
  reviewPeriod: string;
  tasksCompleted: number;
  goalsAchieved: number;
  totalGoals: number;
  managerRating: number;
  overallScore: number;
  comments?: string;
}

// ─── Skills ────────────────────────────────────────────────────────────────
export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface EmployeeSkill {
  id: string;
  skillId: string;
  skill: Skill;
  level: SkillLevel;
}

// ─── AI Insights ───────────────────────────────────────────────────────────
export type InsightType = 'WORKLOAD_RISK' | 'SKILL_GAP' | 'PERFORMANCE_OPPORTUNITY' | 'ATTENDANCE_RISK';
export type InsightSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface WorkforceInsight {
  id: string;
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  description: string;
  employeeIds: string[];
  departmentId?: string;
  createdAt: string;
}
