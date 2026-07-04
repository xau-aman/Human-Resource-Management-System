// Attendance Calculation Utilities for WorkZen HRMS

// Configurable attendance constants
export const ATTENDANCE_CONFIG = {
  workStartTime: '09:30',       // HH:mm
  lateGracePeriodMinutes: 15,
  halfDayMinimumHours: 4,
  fullDayMinimumHours: 8,
  defaultBreakTimeMinutes: 60,
  defaultWorkingHoursPerDay: 8,
  defaultWorkingDaysPerWeek: 5,
};

export interface AttendanceCalcInput {
  checkIn: Date;
  checkOut: Date;
  breakTimeMinutes?: number;
  configuredWorkingHours?: number;
}

export function calculateWorkingMinutes(checkIn: Date, checkOut: Date, breakTimeMinutes = ATTENDANCE_CONFIG.defaultBreakTimeMinutes): number {
  const diffMs = checkOut.getTime() - checkIn.getTime();
  const totalMinutes = Math.floor(diffMs / 60000);
  return Math.max(0, totalMinutes - breakTimeMinutes);
}

export function calculateWorkingHours(checkIn: Date, checkOut: Date, breakTimeMinutes = ATTENDANCE_CONFIG.defaultBreakTimeMinutes): number {
  const minutes = calculateWorkingMinutes(checkIn, checkOut, breakTimeMinutes);
  return parseFloat((minutes / 60).toFixed(2));
}

export function calculateExtraMinutes(workingMinutes: number, configuredWorkingHours = ATTENDANCE_CONFIG.defaultWorkingHoursPerDay): number {
  const expectedMinutes = configuredWorkingHours * 60;
  return Math.max(0, workingMinutes - expectedMinutes);
}

export function calculateExtraHours(workingMinutes: number, configuredWorkingHours = ATTENDANCE_CONFIG.defaultWorkingHoursPerDay): number {
  return parseFloat((calculateExtraMinutes(workingMinutes, configuredWorkingHours) / 60).toFixed(2));
}

export function determineAttendanceStatus(input: {
  checkIn?: Date | null;
  checkOut?: Date | null;
  workingHours?: number;
  breakTimeMinutes?: number;
}): 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT' {
  if (!input.checkIn) return 'ABSENT';

  const workingHours = input.workingHours ?? 0;

  if (workingHours < ATTENDANCE_CONFIG.halfDayMinimumHours) return 'ABSENT';
  if (workingHours < ATTENDANCE_CONFIG.fullDayMinimumHours) return 'HALF_DAY';

  // Check if late
  const checkInHour = input.checkIn.getHours();
  const checkInMinute = input.checkIn.getMinutes();
  const [startHour, startMinute] = ATTENDANCE_CONFIG.workStartTime.split(':').map(Number);
  const graceMinutes = ATTENDANCE_CONFIG.lateGracePeriodMinutes;

  const checkInTotalMinutes = checkInHour * 60 + checkInMinute;
  const allowedTotalMinutes = startHour * 60 + startMinute + graceMinutes;

  if (checkInTotalMinutes > allowedTotalMinutes) return 'LATE';

  return 'PRESENT';
}

export interface MonthlyAttendanceSummary {
  daysPresent: number;
  daysAbsent: number;
  daysLate: number;
  daysHalfDay: number;
  totalWorkingHours: number;
  totalExtraHours: number;
  attendanceRate: number;
}

export function getMonthlyAttendanceSummary(records: { status: string; workingHours?: number | null; extraMinutes?: number | null }[]): MonthlyAttendanceSummary {
  let daysPresent = 0, daysAbsent = 0, daysLate = 0, daysHalfDay = 0;
  let totalWorkingHours = 0, totalExtraMinutes = 0;

  for (const r of records) {
    switch (r.status) {
      case 'PRESENT': daysPresent++; break;
      case 'LATE': daysLate++; break;
      case 'HALF_DAY': daysHalfDay++; break;
      case 'ABSENT': daysAbsent++; break;
    }
    totalWorkingHours += r.workingHours ?? 0;
    totalExtraMinutes += r.extraMinutes ?? 0;
  }

  const totalDays = records.length || 1;
  const attendanceRate = parseFloat((((daysPresent + daysLate + daysHalfDay * 0.5) / totalDays) * 100).toFixed(1));

  return { daysPresent, daysAbsent, daysLate, daysHalfDay, totalWorkingHours: parseFloat(totalWorkingHours.toFixed(1)), totalExtraHours: parseFloat((totalExtraMinutes / 60).toFixed(1)), attendanceRate };
}

export function calculateAttendanceConsistency(records: { status: string }[]): number {
  if (records.length === 0) return 90; // Neutral default
  let score = 0;
  for (const r of records) {
    switch (r.status) {
      case 'PRESENT': score += 1; break;
      case 'LATE': score += 0.85; break;
      case 'HALF_DAY': score += 0.5; break;
      case 'ABSENT': score += 0; break;
    }
  }
  return parseFloat(((score / records.length) * 100).toFixed(1));
}

export interface PayableDaysInput {
  totalWorkingDays: number;
  presentDays: number;
  halfDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  absentDays: number;
}

export function calculatePayableDays(input: PayableDaysInput): number {
  // Present + paid leave + half days * 0.5
  // Unpaid leave and absent days are NOT payable
  return input.presentDays + input.paidLeaveDays + (input.halfDays * 0.5);
}
