interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`/api/v1${path}`);
  const json = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Request failed');
  }
  return json.data;
}

export async function calculateDepartmentPerformance() {
  return request<{ department: string; avgScore: number; employeeCount: number }[]>('/analytics/department-performance');
}

export async function calculateAttendanceTrend(days = 30) {
  return request<{ date: string; present: number; absent: number; late: number }[]>(`/analytics/attendance-trend?days=${days}`);
}

export async function calculateEmployeeGrowth() {
  return request<{ month: string; count: number }[]>('/analytics/employee-growth');
}
