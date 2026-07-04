import { api } from '../config/api';

export interface SalaryBreakdown {
  components: { name: string; code: string; amount: number }[];
  grossSalary: number;
  employeePF: number;
  employerPF: number;
  professionalTax: number;
  totalDeductions: number;
  netSalary: number;
}

export interface SalaryStructure {
  id: string;
  employeeId: string;
  monthlyWage: number;
  yearlyWage: number;
  wageType: string;
  workingDaysPerWeek: number;
  workingHoursPerDay: number;
  breakTimeMinutes: number;
  breakdown: SalaryBreakdown;
}

export async function getEmployeeSalary(employeeId: string): Promise<SalaryStructure | null> {
  const res = await api.get<{ data: SalaryStructure | null }>(`/employees/${employeeId}/salary`);
  return res.data;
}

export async function getSalaryBreakdown(employeeId: string): Promise<SalaryBreakdown | null> {
  const res = await api.get<{ data: SalaryBreakdown | null }>(`/employees/${employeeId}/salary/breakdown`);
  return res.data;
}

export async function updateEmployeeSalary(employeeId: string, data: { monthlyWage: number; workingDaysPerWeek?: number; workingHoursPerDay?: number; breakTimeMinutes?: number }): Promise<SalaryStructure> {
  const res = await api.put<{ data: SalaryStructure }>(`/employees/${employeeId}/salary`, data);
  return res.data;
}

// Indian Rupee formatter
export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}
