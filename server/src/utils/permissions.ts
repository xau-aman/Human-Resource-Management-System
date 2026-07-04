// Centralized Permission System for WorkZen HRMS

export type Permission =
  | 'VIEW_ALL_EMPLOYEES'
  | 'VIEW_SALARY'
  | 'EDIT_SALARY'
  | 'VIEW_ALL_ATTENDANCE'
  | 'VIEW_OWN_ATTENDANCE'
  | 'VIEW_ALL_LEAVE'
  | 'VIEW_OWN_LEAVE'
  | 'APPROVE_LEAVE'
  | 'VIEW_ALL_PERFORMANCE'
  | 'VIEW_OWN_PERFORMANCE'
  | 'MANAGE_PERFORMANCE'
  | 'EXPORT_DATA'
  | 'VIEW_PAYROLL';

type Role = 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'VIEW_ALL_EMPLOYEES', 'VIEW_SALARY', 'EDIT_SALARY',
    'VIEW_ALL_ATTENDANCE', 'VIEW_OWN_ATTENDANCE',
    'VIEW_ALL_LEAVE', 'VIEW_OWN_LEAVE', 'APPROVE_LEAVE',
    'VIEW_ALL_PERFORMANCE', 'VIEW_OWN_PERFORMANCE', 'MANAGE_PERFORMANCE',
    'EXPORT_DATA', 'VIEW_PAYROLL',
  ],
  HR: [
    'VIEW_ALL_EMPLOYEES', 'VIEW_SALARY', 'EDIT_SALARY',
    'VIEW_ALL_ATTENDANCE', 'VIEW_OWN_ATTENDANCE',
    'VIEW_ALL_LEAVE', 'VIEW_OWN_LEAVE', 'APPROVE_LEAVE',
    'VIEW_ALL_PERFORMANCE', 'VIEW_OWN_PERFORMANCE', 'MANAGE_PERFORMANCE',
    'EXPORT_DATA', 'VIEW_PAYROLL',
  ],
  MANAGER: [
    'VIEW_ALL_EMPLOYEES',
    'VIEW_ALL_ATTENDANCE', 'VIEW_OWN_ATTENDANCE',
    'VIEW_ALL_LEAVE', 'VIEW_OWN_LEAVE', 'APPROVE_LEAVE',
    'VIEW_ALL_PERFORMANCE', 'VIEW_OWN_PERFORMANCE',
  ],
  EMPLOYEE: [
    'VIEW_OWN_ATTENDANCE',
    'VIEW_OWN_LEAVE',
    'VIEW_OWN_PERFORMANCE',
  ],
};

export function hasPermission(role: string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role as Role];
  return perms ? perms.includes(permission) : false;
}

export function canViewSalary(role: string): boolean {
  return hasPermission(role, 'VIEW_SALARY');
}

export function canEditSalary(role: string): boolean {
  return hasPermission(role, 'EDIT_SALARY');
}

export function canViewAllAttendance(role: string): boolean {
  return hasPermission(role, 'VIEW_ALL_ATTENDANCE');
}

export function canApproveLeave(role: string): boolean {
  return hasPermission(role, 'APPROVE_LEAVE');
}

export function canViewAllPerformance(role: string): boolean {
  return hasPermission(role, 'VIEW_ALL_PERFORMANCE');
}

export function canManagePerformance(role: string): boolean {
  return hasPermission(role, 'MANAGE_PERFORMANCE');
}

export function canExportData(role: string): boolean {
  return hasPermission(role, 'EXPORT_DATA');
}
