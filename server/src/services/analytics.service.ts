import prisma from '../config/prisma';

function formatDateKey(value: Date): string {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shortMonthLabel(value: Date): string {
  return value.toLocaleDateString('en-US', { month: 'short' });
}

export async function getWorkforceOverview() {
  const [totalEmployees, activeEmployees, onLeave, departments] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { employmentStatus: 'ACTIVE' } }),
    prisma.employee.count({ where: { employmentStatus: 'ON_LEAVE' } }),
    prisma.department.findMany({ include: { _count: { select: { employees: true } } } }),
  ]);
  return { totalEmployees, activeEmployees, onLeave, departments };
}

export async function calculateAttendanceTrend(days: number): Promise<{ date: string; present: number; absent: number; late: number }[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const grouped = await prisma.attendance.groupBy({
    by: ['date', 'status'],
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: { status: true },
  });

  const counts = new Map<string, { date: string; present: number; absent: number; late: number }>();

  for (let index = 0; index < days; index += 1) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + index);
    const key = formatDateKey(current);
    counts.set(key, { date: key, present: 0, absent: 0, late: 0 });
  }

  for (const record of grouped) {
    const key = formatDateKey(record.date);
    const entry = counts.get(key);
    if (!entry) {
      continue;
    }

    if (record.status === 'PRESENT') entry.present = record._count.status;
    else if (record.status === 'ABSENT') entry.absent = record._count.status;
    else if (record.status === 'LATE') entry.late = record._count.status;
  }

  return Array.from(counts.values());
}

export async function calculateDepartmentPerformance(): Promise<{ department: string; avgScore: number; employeeCount: number }[]> {
  const [departments, reviews] = await Promise.all([
    prisma.department.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { employees: true } },
      },
    }),
    prisma.performanceReview.findMany({ select: { overallScore: true, employee: { select: { departmentId: true } } } }),
  ]);

  const scoresByDepartment = new Map<string, { total: number; count: number; employeeCount: number }>();

  for (const department of departments) {
    scoresByDepartment.set(department.id, { total: 0, count: 0, employeeCount: 0 });
  }

  for (const review of reviews) {
    const departmentId = review.employee.departmentId;
    const entry = scoresByDepartment.get(departmentId);
    if (!entry) {
      continue;
    }
    entry.total += review.overallScore;
    entry.count += 1;
  }

  return departments.map((department: { id: string; name: string; _count: { employees: number } }) => {
    const entry = scoresByDepartment.get(department.id) ?? { total: 0, count: 0, employeeCount: 0 };
    return {
      department: department.name,
      avgScore: entry.count > 0 ? Number((entry.total / entry.count).toFixed(1)) : 0,
      employeeCount: department._count.employees,
    };
  });
}

export async function calculateEmployeeGrowth(): Promise<{ month: string; count: number }[]> {
  const employees = await prisma.employee.findMany({ select: { joiningDate: true } });
  const monthlyCounts = new Map<string, number>();

  for (const employee of employees) {
    const monthKey = shortMonthLabel(employee.joiningDate);
    monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) ?? 0) + 1);
  }

  return Array.from(monthlyCounts.entries()).map(([month, count]) => ({ month, count }));
}
