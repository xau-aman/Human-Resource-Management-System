import type { AttendanceRecord, AttendanceSummary } from '../types';
import { api } from '../config/api';

export async function getAttendance(date?: string): Promise<AttendanceRecord[]> {
  const query = date ? `?date=${date}` : '';
  const res = await api.get<{ data: AttendanceRecord[] }>(`/attendance${query}`);
  return res.data;
}

export async function getAttendanceSummary(date?: string): Promise<AttendanceSummary> {
  const query = date ? `?date=${date}` : '';
  const res = await api.get<{ data: AttendanceSummary }>(`/attendance/summary${query}`);
  return res.data;
}

export async function clockIn(): Promise<AttendanceRecord> {
  const res = await api.post<{ data: AttendanceRecord }>('/attendance/clock-in', {});
  return res.data;
}

export async function clockOut(): Promise<AttendanceRecord> {
  const res = await api.post<{ data: AttendanceRecord }>('/attendance/clock-out', {});
  return res.data;
}

export async function getMyAttendance(): Promise<AttendanceRecord[]> {
  const res = await api.get<{ data: AttendanceRecord[] }>('/attendance/me');
  return res.data;
}
