// Salary Calculation Utilities for WorkZen HRMS
// NOTE: Statutory configuration is simplified for hackathon purposes.

export interface SalaryComponentInput {
  name: string;
  code: string;
  calculationType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'REMAINDER';
  percentage?: number;
  fixedAmount?: number;
  calculationBase: 'MONTHLY_WAGE' | 'BASIC_SALARY';
}

export interface SalaryBreakdown {
  components: { name: string; code: string; amount: number }[];
  grossSalary: number;
  employeePF: number;
  employerPF: number;
  professionalTax: number;
  totalDeductions: number;
  netSalary: number;
}

// Default salary component configuration
export const DEFAULT_SALARY_COMPONENTS: SalaryComponentInput[] = [
  { name: 'Basic Salary', code: 'BASIC', calculationType: 'PERCENTAGE', percentage: 50, calculationBase: 'MONTHLY_WAGE' },
  { name: 'House Rent Allowance', code: 'HRA', calculationType: 'PERCENTAGE', percentage: 50, calculationBase: 'BASIC_SALARY' },
  { name: 'Standard Allowance', code: 'STD_ALW', calculationType: 'PERCENTAGE', percentage: 16.67, calculationBase: 'MONTHLY_WAGE' },
  { name: 'Performance Bonus', code: 'PERF_BONUS', calculationType: 'PERCENTAGE', percentage: 8.33, calculationBase: 'MONTHLY_WAGE' },
  { name: 'Leave Travel Allowance', code: 'LTA', calculationType: 'PERCENTAGE', percentage: 8.33, calculationBase: 'MONTHLY_WAGE' },
  { name: 'Fixed Allowance', code: 'FIXED_ALW', calculationType: 'REMAINDER', calculationBase: 'MONTHLY_WAGE' },
];

// Deduction configuration
export const DEDUCTION_CONFIG = {
  employeePFPercentage: 12, // 12% of Basic Salary
  employerPFPercentage: 12, // 12% of Basic Salary
  professionalTax: 200,     // Fixed ₹200/month
};

export function calculateYearlyWage(monthlyWage: number): number {
  return monthlyWage * 12;
}

export function calculateSalaryComponent(
  component: SalaryComponentInput,
  monthlyWage: number,
  basicSalary: number
): number {
  const base = component.calculationBase === 'BASIC_SALARY' ? basicSalary : monthlyWage;

  switch (component.calculationType) {
    case 'PERCENTAGE':
      return Math.round((base * (component.percentage || 0)) / 100);
    case 'FIXED_AMOUNT':
      return component.fixedAmount || 0;
    case 'REMAINDER':
      return 0; // Calculated separately
    default:
      return 0;
  }
}

export function calculateSalaryBreakdown(monthlyWage: number, components: SalaryComponentInput[]): SalaryBreakdown {
  // First pass: calculate basic salary
  const basicComponent = components.find(c => c.code === 'BASIC');
  const basicSalary = basicComponent
    ? calculateSalaryComponent(basicComponent, monthlyWage, 0)
    : Math.round(monthlyWage * 0.5);

  // Second pass: calculate all non-remainder components
  let totalNonRemainder = 0;
  const calculatedComponents: { name: string; code: string; amount: number }[] = [];

  for (const comp of components) {
    if (comp.calculationType === 'REMAINDER') continue;
    const amount = calculateSalaryComponent(comp, monthlyWage, basicSalary);
    calculatedComponents.push({ name: comp.name, code: comp.code, amount });
    totalNonRemainder += amount;
  }

  // Third pass: calculate remainder (Fixed Allowance)
  const remainderComponent = components.find(c => c.calculationType === 'REMAINDER');
  if (remainderComponent) {
    const remainderAmount = Math.max(0, monthlyWage - totalNonRemainder);
    calculatedComponents.push({ name: remainderComponent.name, code: remainderComponent.code, amount: remainderAmount });
  }

  const grossSalary = monthlyWage;
  const employeePF = Math.round((basicSalary * DEDUCTION_CONFIG.employeePFPercentage) / 100);
  const employerPF = Math.round((basicSalary * DEDUCTION_CONFIG.employerPFPercentage) / 100);
  const professionalTax = DEDUCTION_CONFIG.professionalTax;
  const totalDeductions = employeePF + professionalTax;
  const netSalary = grossSalary - totalDeductions;

  return { components: calculatedComponents, grossSalary, employeePF, employerPF, professionalTax, totalDeductions, netSalary };
}

export function calculateRemainingAllowance(monthlyWage: number, components: SalaryComponentInput[]): number {
  const basicComponent = components.find(c => c.code === 'BASIC');
  const basicSalary = basicComponent ? calculateSalaryComponent(basicComponent, monthlyWage, 0) : Math.round(monthlyWage * 0.5);

  let total = 0;
  for (const comp of components) {
    if (comp.calculationType === 'REMAINDER') continue;
    total += calculateSalaryComponent(comp, monthlyWage, basicSalary);
  }
  return Math.max(0, monthlyWage - total);
}

export function validateSalaryStructure(monthlyWage: number, components: SalaryComponentInput[]): { valid: boolean; error?: string } {
  const basicComponent = components.find(c => c.code === 'BASIC');
  const basicSalary = basicComponent ? calculateSalaryComponent(basicComponent, monthlyWage, 0) : Math.round(monthlyWage * 0.5);

  let total = 0;
  for (const comp of components) {
    if (comp.calculationType === 'REMAINDER') continue;
    total += calculateSalaryComponent(comp, monthlyWage, basicSalary);
  }

  if (total > monthlyWage) {
    return { valid: false, error: `Salary components (₹${total}) exceed monthly wage (₹${monthlyWage})` };
  }
  return { valid: true };
}

export function calculateEmployeePF(basicSalary: number): number {
  return Math.round((basicSalary * DEDUCTION_CONFIG.employeePFPercentage) / 100);
}

export function calculateEmployerPF(basicSalary: number): number {
  return Math.round((basicSalary * DEDUCTION_CONFIG.employerPFPercentage) / 100);
}

export function calculateProfessionalTax(): number {
  return DEDUCTION_CONFIG.professionalTax;
}

// Indian Rupee formatter
export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

// TODO[SALARY]: Implement complete payroll generation and payslip processing
