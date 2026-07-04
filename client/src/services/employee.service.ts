import type { Employee } from '../types';
import { mockEmployees } from '../data/employees.data';

// TODO[CORE]: Replace mock implementations with real API calls to /api/v1/employees

export async function getEmployees(filters?: { department?: string; status?: string; search?: string }): Promise<Employee[]> {
  let result = [...mockEmployees];
  if (filters?.department) result = result.filter(e => e.department.name === filters.department);
  if (filters?.status) result = result.filter(e => e.employmentStatus === filters.status);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(e =>
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.employeeId.toLowerCase().includes(q)
    );
  }
  return result;
}

export async function getEmployeeById(id: string): Promise<Employee | undefined> {
  return mockEmployees.find(e => e.id === id);
}

export async function createEmployee(data: Omit<Employee, 'id' | 'employeeId'>): Promise<Employee> {
  // TODO[CORE]: POST /api/v1/employees
  const newEmployee: Employee = { ...data, id: String(Date.now()), employeeId: `WZ${1013 + mockEmployees.length}` };
  return newEmployee;
}

export async function updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
  // TODO[CORE]: PUT /api/v1/employees/:id
  const employee = mockEmployees.find(e => e.id === id);
  if (!employee) throw new Error('Employee not found');
  return { ...employee, ...data };
}
