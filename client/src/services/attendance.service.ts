import type { AttendanceRecord, AttendanceSummary } from '../types';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  const json = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Request failed');
  }

  return json.data;
}

export function calculateWorkingHours(checkIn: string, checkOut: string): number {
  const [inH, inM] = checkIn.split(':').map(Number);
  const [outH, outM] = checkOut.split(':').map(Number);
  return parseFloat(((outH * 60 + outM - (inH * 60 + inM)) / 60).toFixed(2));
}

export async function getAttendance(date?: string): Promise<AttendanceRecord[]> {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return request<AttendanceRecord[]>(`/attendance${query}`);
}

export async function getAttendanceSummary(): Promise<AttendanceSummary> {
  return request<AttendanceSummary>('/attendance/summary');
}
