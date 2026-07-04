import prisma from '../config/prisma';

export interface WorkforceContext {
  totalEmployees: number;
  departments: { name: string; count: number; avgScore: number }[];
  attendanceSummary: { present: number; absent: number; late: number; rate: number };
  overloadedEmployees: { name: string; department: string; taskCount: number; score: number }[];
  topPerformers: { name: string; department: string; score: number }[];
  lowPerformers: { name: string; department: string; score: number }[];
  skillGaps: { skill: string; employeesWithSkill: number; total: number }[];
  pendingLeaves: { name: string; type: string; days: number }[];
  onLeave: string[];
  recentInsights: { type: string; title: string; severity: string }[];
}

export async function buildWorkforceContext(): Promise<WorkforceContext> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [employees, departments, todayAttendance, reviews, skills, leaves, insights] = await Promise.all([
    prisma.employee.findMany({
      where: { employmentStatus: { not: 'TERMINATED' } },
      include: {
        department: true,
        performanceReviews: { orderBy: { createdAt: 'desc' }, take: 1 },
        projectAssignments: true,
        employeeSkills: { include: { skill: true } },
      },
    }),
    prisma.department.findMany({ include: { _count: { select: { employees: true } } } }),
    prisma.attendance.findMany({ where: { date: today } }),
    prisma.performanceReview.findMany({ orderBy: { overallScore: 'desc' } }),
    prisma.skill.findMany({ include: { employeeSkills: true } }),
    prisma.leaveRequest.findMany({
      where: { status: 'PENDING' },
      include: { employee: { select: { firstName: true, lastName: true } } },
    }),
    prisma.workforceInsight.findMany({ where: { isResolved: false }, take: 5 }),
  ]);

  const totalEmployees = employees.length;

  const present = todayAttendance.filter((a: { status: string }) => a.status === 'PRESENT').length;
  const absent = todayAttendance.filter((a: { status: string }) => a.status === 'ABSENT').length;
  const late = todayAttendance.filter((a: { status: string }) => a.status === 'LATE').length;
  const attendanceRate = totalEmployees > 0 ? Math.round((present / totalEmployees) * 100) : 0;

  const deptScores: Record<string, number[]> = {};
  reviews.forEach((r: { employeeId: string; overallScore: number }) => {
    const emp = employees.find((e: { id: string }) => e.id === r.employeeId);
    if (emp) {
      const deptName = (emp as { department: { name: string } }).department.name;
      if (!deptScores[deptName]) deptScores[deptName] = [];
      deptScores[deptName].push(r.overallScore);
    }
  });

  const departmentSummary = departments.map((d: { name: string; _count: { employees: number } }) => ({
    name: d.name,
    count: d._count.employees,
    avgScore: deptScores[d.name]?.length
      ? Math.round(deptScores[d.name].reduce((a: number, b: number) => a + b, 0) / deptScores[d.name].length)
      : 0,
  }));

  const overloaded = employees
    .filter((e: { projectAssignments: unknown[] }) => e.projectAssignments.length >= 2)
    .map((e: { firstName: string; lastName: string; department: { name: string }; projectAssignments: unknown[]; performanceReviews: { overallScore: number }[] }) => ({
      name: `${e.firstName} ${e.lastName}`,
      department: e.department.name,
      taskCount: e.projectAssignments.length,
      score: e.performanceReviews[0]?.overallScore ?? 0,
    }))
    .slice(0, 5);

  const sortedReviews = [...reviews].sort((a: { overallScore: number }, b: { overallScore: number }) => b.overallScore - a.overallScore);

  const mapReview = (r: { employeeId: string; overallScore: number }) => {
    const emp = employees.find((e: { id: string }) => e.id === r.employeeId) as { firstName: string; lastName: string; department: { name: string } } | undefined;
    return { name: emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown', department: emp?.department.name ?? '', score: r.overallScore };
  };

  const topPerformers = sortedReviews.slice(0, 3).map(mapReview);
  const lowPerformers = sortedReviews.slice(-3).map(mapReview);

  const skillGaps = skills.map((s: { name: string; employeeSkills: unknown[] }) => ({
    skill: s.name,
    employeesWithSkill: s.employeeSkills.length,
    total: totalEmployees,
  })).sort((a: { employeesWithSkill: number }, b: { employeesWithSkill: number }) => a.employeesWithSkill - b.employeesWithSkill).slice(0, 5);

  const pendingLeaves = leaves.map((l: { employee: { firstName: string; lastName: string }; leaveType: string; startDate: Date; endDate: Date }) => {
    const days = Math.ceil((new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / 86400000) + 1;
    return { name: `${l.employee.firstName} ${l.employee.lastName}`, type: l.leaveType, days };
  });

  const onLeave = employees
    .filter((e: { employmentStatus: string }) => e.employmentStatus === 'ON_LEAVE')
    .map((e: { firstName: string; lastName: string }) => `${e.firstName} ${e.lastName}`);

  return {
    totalEmployees, departments: departmentSummary,
    attendanceSummary: { present, absent, late, rate: attendanceRate },
    overloadedEmployees: overloaded, topPerformers, lowPerformers,
    skillGaps, pendingLeaves, onLeave,
    recentInsights: insights.map((i: { type: string; title: string; severity: string }) => ({ type: i.type, title: i.title, severity: i.severity })),
  };
}
