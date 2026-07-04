import type { Employee } from '../types';
import { api } from '../config/api';

export async function getDepartments(): Promise<{ id: string; name: string }[]> {
  const res = await api.get<{ data: { id: string; name: string }[] }>('/employees/departments');
  return res.data;
}

export async function getEmployees(filters?: { department?: string; status?: string; search?: string }): Promise<Employee[]> {
  const params = new URLSearchParams();
  if (filters?.department) params.set('department', filters.department);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.search) params.set('search', filters.search);
  const query = params.toString() ? `?${params}` : '';
  const res = await api.get<{ data: Employee[] }>(`/employees${query}`);
  return res.data;
}

export async function getEmployeeById(id: string): Promise<Employee> {
  const res = await api.get<{ data: Employee }>(`/employees/${id}`);
  return res.data;
}

export async function createEmployee(data: Omit<Employee, 'id' | 'employeeId'>): Promise<Employee> {
  const res = await api.post<{ data: Employee }>('/employees', data);
  return res.data;
}

export async function updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
  const res = await api.put<{ data: Employee }>(`/employees/${id}`, data);
  return res.data;
}
