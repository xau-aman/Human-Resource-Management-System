# Salary Calculations

## Overview

WorkZen HRMS implements a configurable salary structure with component-based breakdown, statutory deductions, and net salary estimation.

**Note:** Statutory configuration is simplified for hackathon purposes. This is not a complete Indian payroll system.

## Salary Structure

Each employee has a `SalaryStructure` containing:

| Field | Description | Default |
|-------|-------------|---------|
| monthlyWage | Total monthly CTC | — |
| yearlyWage | monthlyWage × 12 (auto-calculated) | — |
| wageType | FIXED | FIXED |
| workingDaysPerWeek | Days per week | 5 |
| workingHoursPerDay | Hours per day | 8 |
| breakTimeMinutes | Break duration | 60 |

## Salary Components

| Component | Calculation | Base | Default % |
|-----------|-------------|------|-----------|
| Basic Salary | PERCENTAGE | Monthly Wage | 50% |
| House Rent Allowance | PERCENTAGE | Basic Salary | 50% |
| Standard Allowance | PERCENTAGE | Monthly Wage | 16.67% |
| Performance Bonus | PERCENTAGE | Monthly Wage | 8.33% |
| Leave Travel Allowance | PERCENTAGE | Monthly Wage | 8.33% |
| Fixed Allowance | REMAINDER | Monthly Wage | Auto |

### Calculation Types

- **PERCENTAGE**: `base × percentage / 100`
- **FIXED_AMOUNT**: Static amount
- **REMAINDER**: `monthlyWage - sum(otherComponents)`

### Validation Rule

The sum of all salary components must NEVER exceed the monthly wage. If it does, the system returns a validation error.

## Example: ₹50,000 Monthly Wage

```
Basic Salary:      50% of ₹50,000 = ₹25,000
HRA:               50% of ₹25,000 = ₹12,500
Standard Allow:    16.67% of ₹50,000 = ₹8,335
Performance Bonus: 8.33% of ₹50,000 = ₹4,165
LTA:               8.33% of ₹50,000 = ₹4,165
Fixed Allowance:   Remainder = ₹50,000 - ₹54,165 = ₹0 (or adjusted)
```

## Statutory Deductions

| Deduction | Calculation | Default |
|-----------|-------------|---------|
| Employee PF | % of Basic Salary | 12% |
| Employer PF | % of Basic Salary | 12% |
| Professional Tax | Fixed amount | ₹200/month |

### Net Salary Formula

```
Gross Salary = Monthly Wage
Employee Deductions = Employee PF + Professional Tax
Net Salary = Gross Salary - Employee Deductions
```

**Note:** Employer PF does NOT reduce employee net salary.

## Example: ₹50,000 Monthly Wage

```
Basic Salary: ₹25,000
Employee PF: 12% of ₹25,000 = ₹3,000
Professional Tax: ₹200

Gross: ₹50,000
Deductions: ₹3,200
Net Salary: ₹46,800

Employer PF (company cost): ₹3,000
```

## Currency Formatting

All amounts use Indian Rupee formatting:
```
₹50,000
₹6,00,000
₹1,20,000
```

## Access Control

Salary information is restricted to:
- **ADMIN**: Full view and edit
- **HR**: Full view and edit
- **MANAGER**: No access
- **EMPLOYEE**: No access (can only see own payslip)

Both frontend UI hiding AND backend authorization are enforced.

## API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/employees/:id/salary` | Get salary structure + breakdown | Admin, HR |
| GET | `/employees/:id/salary/breakdown` | Get calculated breakdown only | Admin, HR |
| PUT | `/employees/:id/salary` | Update salary structure | Admin, HR |

## Limitations

- No income tax slab calculation
- No ESI computation
- No gratuity calculation
- No payslip generation with payment processing
- Performance bonus is recommendation-only (not auto-applied)

// TODO[SALARY]: Implement complete payroll generation and payslip processing
