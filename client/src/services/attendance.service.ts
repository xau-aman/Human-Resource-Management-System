import type { AttendanceRecord, AttendanceSummary } from '../types';
import { mockAttendance } from '../data/attendance.data';

// TODO[ATTENDANCE]: Replace with real API calls to /api/v1/attendance

/**
 * Calculate working hours between check-in and check-out strings.
 * TODO[ATTENDANCE]: Implement attendance calculation logic
 * @param checkIn - time string e.g. "09:00"
 * @param checkOut - time string e.g. "18:00"
 * @returns hours worked as number
 */
export function calculateWorkingHours(checkIn: string, checkOut: string): number {
  // Temporary implementation
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  return parseFloat(((outH * 60 + outM - (inH * 60 + inM)) / 60).toFixed(2));
}

export async function getAttendance(date?: string): Promise<AttendanceRecord[]> {
  if (date) return mockAttendance.filter(a => a.date === date);
  return mockAttendance;
}

export async function getAttendanceSummary(): Promise<AttendanceSummary> {
  const records = mockAttendance;
  return {
    present: records.filter(r => r.status === 'PRESENT').length,
    absent: records.filter(r => r.status === 'ABSENT').length,
    late: records.filter(r => r.status === 'LATE').length,
    halfDay: records.filter(r => r.status === 'HALF_DAY').length,
    total: records.length,
  };
}
