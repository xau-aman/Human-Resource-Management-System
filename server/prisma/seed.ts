import { PrismaClient, UserRole, EmploymentStatus, AttendanceStatus, LeaveType, LeaveStatus, SkillLevel } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding WorkZen HRMS database...');

  // Clean existing data
  await prisma.salaryComponent.deleteMany();
  await prisma.salaryStructure.deleteMany();
  await prisma.projectAssignment.deleteMany();
  await prisma.project.deleteMany();
  await prisma.workforceInsight.deleteMany();
  await prisma.employeeSkill.deleteMany();
  await prisma.performanceReview.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.department.deleteMany();

  const passwordHash = await bcrypt.hash('admin123', 10);
  const empPasswordHash = await bcrypt.hash('emp123', 10);

  // Departments
  const [engineering, design, marketing, hr] = await Promise.all([
    prisma.department.create({ data: { name: 'Engineering', description: 'Software development and infrastructure' } }),
    prisma.department.create({ data: { name: 'Design', description: 'UI/UX and product design' } }),
    prisma.department.create({ data: { name: 'Marketing', description: 'Growth, brand, and communications' } }),
    prisma.department.create({ data: { name: 'Human Resources', description: 'People operations and culture' } }),
  ]);

  // Skills
  const skillData = [
    { name: 'React', category: 'Frontend' }, { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' }, { name: 'TypeScript', category: 'Frontend' },
    { name: 'PostgreSQL', category: 'Database' }, { name: 'Leadership', category: 'Soft Skills' },
    { name: 'Communication', category: 'Soft Skills' }, { name: 'Project Management', category: 'Management' },
    { name: 'Figma', category: 'Design' }, { name: 'AWS', category: 'Cloud' },
  ];
  const skills = await Promise.all(skillData.map(s => prisma.skill.create({ data: s })));

  // Employees with salaries
  const employeeData = [
    { firstName: 'Arjun', lastName: 'Sharma', email: 'admin@workzen.com', designation: 'Engineering Manager', dept: engineering.id, role: UserRole.ADMIN, status: EmploymentStatus.ACTIVE, joining: new Date('2021-03-15'), hash: passwordHash, salary: 180000 },
    { firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@workzen.com', designation: 'Senior Frontend Developer', dept: engineering.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ACTIVE, joining: new Date('2021-07-01'), hash: empPasswordHash, salary: 120000 },
    { firstName: 'Rahul', lastName: 'Verma', email: 'rahul.verma@workzen.com', designation: 'Backend Developer', dept: engineering.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ACTIVE, joining: new Date('2022-01-10'), hash: empPasswordHash, salary: 95000 },
    { firstName: 'Sneha', lastName: 'Iyer', email: 'sneha.iyer@workzen.com', designation: 'Full Stack Developer', dept: engineering.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ACTIVE, joining: new Date('2022-06-20'), hash: empPasswordHash, salary: 110000 },
    { firstName: 'Vikram', lastName: 'Nair', email: 'vikram.nair@workzen.com', designation: 'DevOps Engineer', dept: engineering.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ON_LEAVE, joining: new Date('2021-11-05'), hash: empPasswordHash, salary: 105000 },
    { firstName: 'Ananya', lastName: 'Reddy', email: 'ananya.reddy@workzen.com', designation: 'Lead Designer', dept: design.id, role: UserRole.MANAGER, status: EmploymentStatus.ACTIVE, joining: new Date('2021-04-12'), hash: empPasswordHash, salary: 140000 },
    { firstName: 'Karan', lastName: 'Mehta', email: 'karan.mehta@workzen.com', designation: 'UI/UX Designer', dept: design.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ACTIVE, joining: new Date('2022-03-08'), hash: empPasswordHash, salary: 85000 },
    { firstName: 'Divya', lastName: 'Singh', email: 'divya.singh@workzen.com', designation: 'Marketing Manager', dept: marketing.id, role: UserRole.MANAGER, status: EmploymentStatus.ACTIVE, joining: new Date('2021-09-01'), hash: empPasswordHash, salary: 130000 },
    { firstName: 'Rohan', lastName: 'Gupta', email: 'rohan.gupta@workzen.com', designation: 'Content Strategist', dept: marketing.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ACTIVE, joining: new Date('2022-08-15'), hash: empPasswordHash, salary: 75000 },
    { firstName: 'Meera', lastName: 'Krishnan', email: 'meera.krishnan@workzen.com', designation: 'Growth Analyst', dept: marketing.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ACTIVE, joining: new Date('2023-01-20'), hash: empPasswordHash, salary: 70000 },
    { firstName: 'Aditya', lastName: 'Joshi', email: 'hr@workzen.com', designation: 'HR Manager', dept: hr.id, role: UserRole.HR, status: EmploymentStatus.ACTIVE, joining: new Date('2021-02-01'), hash: passwordHash, salary: 150000 },
    { firstName: 'Pooja', lastName: 'Desai', email: 'pooja.desai@workzen.com', designation: 'HR Executive', dept: hr.id, role: UserRole.HR, status: EmploymentStatus.ACTIVE, joining: new Date('2022-05-10'), hash: empPasswordHash, salary: 80000 },
  ];

  const createdEmployees: { id: string; firstName: string }[] = [];

  for (let i = 0; i < employeeData.length; i++) {
    const emp = employeeData[i];
    const user = await prisma.user.create({ data: { email: emp.email, passwordHash: emp.hash, role: emp.role } });
    const employee = await prisma.employee.create({
      data: {
        employeeId: `WZ${String(1001 + i).padStart(4, '0')}`,
        firstName: emp.firstName, lastName: emp.lastName, email: emp.email,
        phone: `+91 98${String(10000000 + i * 1234567).slice(0, 8)}`,
        designation: emp.designation, joiningDate: emp.joining,
        employmentStatus: emp.status, departmentId: emp.dept, userId: user.id,
        salary: emp.salary,
      },
    });
    createdEmployees.push({ id: employee.id, firstName: emp.firstName });

    // Create salary structure with default components
    const structure = await prisma.salaryStructure.create({
      data: { employeeId: employee.id, monthlyWage: emp.salary, yearlyWage: emp.salary * 12, wageType: 'FIXED', workingDaysPerWeek: 5, workingHoursPerDay: 8, breakTimeMinutes: 60 },
    });

    const defaultComponents = [
      { name: 'Basic Salary', code: 'BASIC', calculationType: 'PERCENTAGE' as const, percentage: 50, calculationBase: 'MONTHLY_WAGE' as const, sortOrder: 0 },
      { name: 'House Rent Allowance', code: 'HRA', calculationType: 'PERCENTAGE' as const, percentage: 50, calculationBase: 'BASIC_SALARY' as const, sortOrder: 1 },
      { name: 'Standard Allowance', code: 'STD_ALW', calculationType: 'PERCENTAGE' as const, percentage: 16.67, calculationBase: 'MONTHLY_WAGE' as const, sortOrder: 2 },
      { name: 'Performance Bonus', code: 'PERF_BONUS', calculationType: 'PERCENTAGE' as const, percentage: 8.33, calculationBase: 'MONTHLY_WAGE' as const, sortOrder: 3 },
      { name: 'Leave Travel Allowance', code: 'LTA', calculationType: 'PERCENTAGE' as const, percentage: 8.33, calculationBase: 'MONTHLY_WAGE' as const, sortOrder: 4 },
      { name: 'Fixed Allowance', code: 'FIXED_ALW', calculationType: 'REMAINDER' as const, calculationBase: 'MONTHLY_WAGE' as const, sortOrder: 5 },
    ];

    for (const comp of defaultComponents) {
      await prisma.salaryComponent.create({ data: { salaryStructureId: structure.id, ...comp } });
    }
  }

  // Attendance - last 20 working days for realistic data
  const today = new Date();
  for (const emp of createdEmployees) {
    for (let d = 0; d < 20; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - d);
      date.setHours(0, 0, 0, 0);
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const rand = Math.random();
      let status: AttendanceStatus;
      let checkInHour: number, checkInMin: number;

      if (rand < 0.65) { status = 'PRESENT'; checkInHour = 9; checkInMin = Math.floor(Math.random() * 30); }
      else if (rand < 0.80) { status = 'LATE'; checkInHour = 10; checkInMin = Math.floor(Math.random() * 60); }
      else if (rand < 0.90) { status = 'HALF_DAY'; checkInHour = 9; checkInMin = 30; }
      else { status = 'ABSENT'; checkInHour = 0; checkInMin = 0; }

      const checkIn = status !== 'ABSENT' ? new Date(date.getTime() + checkInHour * 3600000 + checkInMin * 60000) : null;
      const workHours = status === 'PRESENT' ? 8 + Math.random() * 1.5 : status === 'LATE' ? 7 + Math.random() : status === 'HALF_DAY' ? 4 + Math.random() : 0;
      const checkOut = checkIn && workHours > 0 ? new Date(checkIn.getTime() + (workHours + 1) * 3600000) : null; // +1 for break
      const workingMinutes = Math.round(workHours * 60);
      const extraMinutes = Math.max(0, workingMinutes - 480); // 480 = 8 hours

      await prisma.attendance.upsert({
        where: { employeeId_date: { employeeId: emp.id, date } },
        update: {},
        create: { employeeId: emp.id, date, checkIn, checkOut, status, workingHours: parseFloat(workHours.toFixed(2)), workingMinutes, extraMinutes },
      });
    }
  }

  // Leave requests
  const leaveData = [
    { empIdx: 1, type: LeaveType.SICK, start: '2025-06-20', end: '2025-06-22', reason: 'Fever and cold', status: LeaveStatus.APPROVED },
    { empIdx: 4, type: LeaveType.CASUAL, start: '2025-07-01', end: '2025-07-02', reason: 'Family function', status: LeaveStatus.PENDING },
    { empIdx: 2, type: LeaveType.PAID, start: '2025-07-10', end: '2025-07-12', reason: 'Vacation', status: LeaveStatus.PENDING },
    { empIdx: 6, type: LeaveType.CASUAL, start: '2025-06-26', end: '2025-06-26', reason: 'Personal work', status: LeaveStatus.APPROVED },
    { empIdx: 8, type: LeaveType.UNPAID, start: '2025-06-15', end: '2025-06-18', reason: 'Personal emergency', status: LeaveStatus.APPROVED },
    { empIdx: 3, type: LeaveType.SICK, start: '2025-06-28', end: '2025-06-28', reason: 'Doctor appointment', status: LeaveStatus.APPROVED },
  ];
  for (const l of leaveData) {
    const days = Math.floor((new Date(l.end).getTime() - new Date(l.start).getTime()) / 86400000) + 1;
    await prisma.leaveRequest.create({
      data: { employeeId: createdEmployees[l.empIdx].id, leaveType: l.type, startDate: new Date(l.start), endDate: new Date(l.end), duration: days, reason: l.reason, status: l.status },
    });
  }

  // Performance reviews - multiple periods for trend data
  const periods = ['Q1 2025', 'Q2 2025', 'Q3 2025'];
  const baseMetrics = [
    { tasks: 32, goals: [5, 6], rating: 4.5, skill: 80 },
    { tasks: 28, goals: [4, 5], rating: 4.2, skill: 75 },
    { tasks: 22, goals: [3, 5], rating: 3.8, skill: 65 },
    { tasks: 25, goals: [5, 6], rating: 4.7, skill: 85 },
    { tasks: 18, goals: [3, 5], rating: 3.5, skill: 60 },
    { tasks: 30, goals: [5, 6], rating: 4.7, skill: 90 },
    { tasks: 20, goals: [4, 5], rating: 4.0, skill: 70 },
    { tasks: 24, goals: [4, 6], rating: 4.0, skill: 72 },
    { tasks: 19, goals: [3, 5], rating: 3.7, skill: 55 },
    { tasks: 21, goals: [3, 5], rating: 3.9, skill: 60 },
    { tasks: 22, goals: [4, 5], rating: 4.3, skill: 78 },
    { tasks: 18, goals: [4, 5], rating: 4.1, skill: 68 },
  ];

  for (let p = 0; p < periods.length; p++) {
    for (let i = 0; i < createdEmployees.length; i++) {
      const m = baseMetrics[i];
      // Slight variation per period to show growth
      const variation = 1 + (p * 0.05) + (Math.random() * 0.1 - 0.05);
      const tasks = Math.round(m.tasks * variation);
      const goalsAchieved = Math.min(m.goals[0] + (p > 1 ? 1 : 0), m.goals[1]);

      await prisma.performanceReview.create({
        data: {
          employeeId: createdEmployees[i].id,
          reviewPeriod: periods[p],
          assignedTasks: Math.round(m.tasks * 1.2),
          tasksCompleted: tasks,
          assignedGoals: m.goals[1],
          goalsAchieved,
          totalGoals: m.goals[1],
          managerRating: Math.min(5, m.rating + p * 0.1),
          skillGrowthScore: Math.min(100, m.skill + p * 5),
          overallScore: 0, // Will be calculated by service
          comments: `${periods[p]} review completed.`,
        },
      });
    }
  }

  // Skills
  const skillAssignments = [[0, 3, 5, 9], [0, 3, 1], [1, 2, 4], [0, 1, 3, 4], [9, 1, 4], [8, 6, 7], [8, 6], [6, 7, 5], [6, 7], [6, 7, 2], [5, 6, 7], [5, 6]];
  const levels = [SkillLevel.BEGINNER, SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED, SkillLevel.EXPERT];
  for (let i = 0; i < createdEmployees.length; i++) {
    for (const skillIdx of skillAssignments[i] || []) {
      await prisma.employeeSkill.create({
        data: { employeeId: createdEmployees[i].id, skillId: skills[skillIdx].id, level: levels[Math.floor(Math.random() * levels.length)] },
      });
    }
  }

  // Project
  const project = await prisma.project.create({ data: { name: 'WorkZen Platform v2', description: 'Next gen HRMS', startDate: new Date('2024-10-01'), status: 'ACTIVE' } });
  for (let i = 0; i < 4; i++) {
    await prisma.projectAssignment.create({ data: { projectId: project.id, employeeId: createdEmployees[i].id, role: i === 0 ? 'Tech Lead' : 'Developer' } });
  }

  // Insights
  await prisma.workforceInsight.createMany({
    data: [
      { type: 'WORKLOAD_RISK', severity: 'HIGH', title: 'Engineering team overloaded', description: 'Engineering team has 40% more tasks than capacity this sprint.', employeeIds: [createdEmployees[0].id, createdEmployees[1].id], departmentId: engineering.id },
      { type: 'SKILL_GAP', severity: 'MEDIUM', title: 'Cloud skills gap in Engineering', description: 'Only 1 of 5 engineers has AWS expertise. 3 upcoming projects require cloud skills.', employeeIds: [], departmentId: engineering.id },
      { type: 'ATTENDANCE_RISK', severity: 'MEDIUM', title: 'Attendance dip in Marketing', description: 'Marketing attendance dropped 15% this month.', employeeIds: [createdEmployees[8].id], departmentId: marketing.id },
      { type: 'PERFORMANCE_OPPORTUNITY', severity: 'LOW', title: 'High performer ready for promotion', description: 'Ananya Reddy has scored above 90% for 3 consecutive quarters.', employeeIds: [createdEmployees[5].id], departmentId: design.id },
    ],
  });

  console.log('✅ Seed complete!');
  console.log('📧 Admin login: admin@workzen.com / admin123');
  console.log('📧 HR login: hr@workzen.com / admin123');
  console.log('📧 Employee login: priya.patel@workzen.com / emp123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
