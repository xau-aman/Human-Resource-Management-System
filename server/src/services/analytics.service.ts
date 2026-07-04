import prisma from '../config/prisma';

// TODO[ANALYTICS]: Implement workforce analytics calculations

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
  // TODO[ANALYTICS]: Replace with real DB aggregation
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push({
      date: d.toISOString().split('T')[0],
      present: 8 + Math.floor(Math.random() * 4),
      absent: Math.floor(Math.random() * 3),
      late: Math.floor(Math.random() * 2),
    });
  }
  return result;
}

export async function calculateDepartmentPerformance(): Promise<{ department: string; avgScore: number; employeeCount: number }[]> {
  // TODO[ANALYTICS]: Replace with real aggregation from performance reviews
  const departments = await prisma.department.findMany({ include: { _count: { select: { employees: true } } } });
  return departments.map((d: { name: string; _count: { employees: number } }) => ({
    department: d.name,
    avgScore: parseFloat((65 + Math.random() * 25).toFixed(1)),
    employeeCount: d._count.employees,
  }));
}

export async function calculateEmployeeGrowth(): Promise<{ month: string; count: number }[]> {
  // TODO[ANALYTICS]: Implement real employee growth calculation
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let count = 8;
  return months.map(month => {
    count += Math.floor(Math.random() * 2);
    return { month, count };
  });
}
