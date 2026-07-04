import { PrismaClient, UserRole, EmploymentStatus, AttendanceStatus, LeaveType, LeaveStatus, SkillLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding WorkZen HRMS database...');

  // Departments
  const [engineering, design, marketing, hr] = await Promise.all([
    prisma.department.upsert({ where: { name: 'Engineering' }, update: {}, create: { name: 'Engineering', description: 'Software development and infrastructure' } }),
    prisma.department.upsert({ where: { name: 'Design' }, update: {}, create: { name: 'Design', description: 'UI/UX and product design' } }),
    prisma.department.upsert({ where: { name: 'Marketing' }, update: {}, create: { name: 'Marketing', description: 'Growth, brand, and communications' } }),
    prisma.department.upsert({ where: { name: 'Human Resources' }, update: {}, create: { name: 'Human Resources', description: 'People operations and culture' } }),
  ]);

  // Skills
  const skillData = [
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Leadership', category: 'Soft Skills' },
    { name: 'Communication', category: 'Soft Skills' },
    { name: 'Project Management', category: 'Management' },
    { name: 'Figma', category: 'Design' },
    { name: 'AWS', category: 'Cloud' },
  ];
  const skills = await Promise.all(
    skillData.map(s => prisma.skill.upsert({ where: { name: s.name }, update: {}, create: s }))
  );

  // Users + Employees
  const employeeData = [
    { firstName: 'Arjun', lastName: 'Sharma', email: 'arjun.sharma@workzen.com', designation: 'Engineering Manager', dept: engineering.id, role: UserRole.MANAGER, status: EmploymentStatus.ACTIVE, joining: new Date('2021-03-15') },
    { firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@workzen.com', designation: 'Senior Frontend Developer', dept: engineering.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ACTIVE, joining: new Date('2021-07-01') },
    { firstName: 'Rahul', lastName: 'Verma', email: 'rahul.verma@workzen.com', designation: 'Backend Developer', dept: engineering.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ACTIVE, joining: new Date('2022-01-10') },
    { firstName: 'Sneha', lastName: 'Iyer', email: 'sneha.iyer@workzen.com', designation: 'Full Stack Developer', dept: engineering.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ACTIVE, joining: new Date('2022-06-20') },
    { firstName: 'Vikram', lastName: 'Nair', email: 'vikram.nair@workzen.com', designation: 'DevOps Engineer', dept: engineering.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ON_LEAVE, joining: new Date('2021-11-05') },
    { firstName: 'Ananya', lastName: 'Reddy', email: 'ananya.reddy@workzen.com', designation: 'Lead Designer', dept: design.id, role: UserRole.MANAGER, status: EmploymentStatus.ACTIVE, joining: new Date('2021-04-12') },
    { firstName: 'Karan', lastName: 'Mehta', email: 'karan.mehta@workzen.com', designation: 'UI/UX Designer', dept: design.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ACTIVE, joining: new Date('2022-03-08') },
    { firstName: 'Divya', lastName: 'Singh', email: 'divya.singh@workzen.com', designation: 'Marketing Manager', dept: marketing.id, role: UserRole.MANAGER, status: EmploymentStatus.ACTIVE, joining: new Date('2021-09-01') },
    { firstName: 'Rohan', lastName: 'Gupta', email: 'rohan.gupta@workzen.com', designation: 'Content Strategist', dept: marketing.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ACTIVE, joining: new Date('2022-08-15') },
    { firstName: 'Meera', lastName: 'Krishnan', email: 'meera.krishnan@workzen.com', designation: 'Growth Analyst', dept: marketing.id, role: UserRole.EMPLOYEE, status: EmploymentStatus.ACTIVE, joining: new Date('2023-01-20') },
    { firstName: 'Aditya', lastName: 'Joshi', email: 'aditya.joshi@workzen.com', designation: 'HR Manager', dept: hr.id, role: UserRole.HR, status: EmploymentStatus.ACTIVE, joining: new Date('2021-02-01') },
    { firstName: 'Pooja', lastName: 'Desai', email: 'pooja.desai@workzen.com', designation: 'HR Executive', dept: hr.id, role: UserRole.HR, status: EmploymentStatus.ACTIVE, joining: new Date('2022-05-10') },
  ];

  const createdEmployees: { id: string; firstName: string; dept: string }[] = [];

  for (let i = 0; i < employeeData.length; i++) {
    const emp = employeeData[i];
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: { email: emp.email, passwordHash: '$2b$10$mockhashedpassword', role: emp.role },
    });
    const employee = await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        employeeId: `WZ${String(1001 + i).padStart(4, '0')}`,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        phone: `+91 98${String(10000000 + i * 1234567).slice(0, 8)}`,
        designation: emp.designation,
        joiningDate: emp.joining,
        employmentStatus: emp.status,
        departmentId: emp.dept,
        userId: user.id,
      },
    });
    createdEmployees.push({ id: employee.id, firstName: emp.firstName, dept: emp.dept });
  }

  // Attendance records for last 7 days
  const today = new Date();
  for (const emp of createdEmployees) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - d);
      date.setHours(0, 0, 0, 0);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      if (isWeekend) continue;
      const statuses: AttendanceStatus[] = [AttendanceStatus.PRESENT, AttendanceStatus.PRESENT, AttendanceStatus.PRESENT, AttendanceStatus.LATE, AttendanceStatus.ABSENT];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      await prisma.attendance.upsert({
        where: { employeeId_date: { employeeId: emp.id, date } },
        update: {},
        create: {
          employeeId: emp.id,
          date,
          checkIn: status !== AttendanceStatus.ABSENT ? new Date(date.getTime() + 9 * 3600000) : null,
          checkOut: status !== AttendanceStatus.ABSENT ? new Date(date.getTime() + 18 * 3600000) : null,
          status,
          workingHours: status !== AttendanceStatus.ABSENT ? 9 : 0,
        },
      });
    }
  }

  // Leave requests
  const leaveData = [
    { empIdx: 1, type: LeaveType.SICK, start: new Date('2024-12-20'), end: new Date('2024-12-22'), reason: 'Fever and cold', status: LeaveStatus.APPROVED },
    { empIdx: 4, type: LeaveType.CASUAL, start: new Date('2024-12-23'), end: new Date('2024-12-24'), reason: 'Family function', status: LeaveStatus.PENDING },
    { empIdx: 2, type: LeaveType.PAID, start: new Date('2025-01-02'), end: new Date('2025-01-05'), reason: 'Vacation', status: LeaveStatus.PENDING },
    { empIdx: 6, type: LeaveType.CASUAL, start: new Date('2024-12-26'), end: new Date('2024-12-26'), reason: 'Personal work', status: LeaveStatus.APPROVED },
  ];
  for (const l of leaveData) {
    await prisma.leaveRequest.create({
      data: { employeeId: createdEmployees[l.empIdx].id, leaveType: l.type, startDate: l.start, endDate: l.end, reason: l.reason, status: l.status },
    });
  }

  // Performance reviews
  for (let i = 0; i < createdEmployees.length; i++) {
    await prisma.performanceReview.create({
      data: {
        employeeId: createdEmployees[i].id,
        reviewPeriod: 'Q4 2024',
        tasksCompleted: 15 + Math.floor(Math.random() * 20),
        goalsAchieved: 3 + Math.floor(Math.random() * 4),
        totalGoals: 6,
        managerRating: parseFloat((3 + Math.random() * 2).toFixed(1)),
        overallScore: parseFloat((60 + Math.random() * 35).toFixed(1)),
        comments: 'Good performance this quarter.',
      },
    });
  }

  // Employee skills
  const skillAssignments = [
    [0, 1, 3, 5, 9], [0, 3, 1], [1, 2, 4], [0, 1, 3, 4], [9, 1, 4],
    [8, 6, 7], [8, 6], [6, 7, 5], [6, 7], [6, 7, 2],
    [5, 6, 7], [5, 6],
  ];
  const levels = [SkillLevel.BEGINNER, SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED, SkillLevel.EXPERT];
  for (let i = 0; i < createdEmployees.length; i++) {
    for (const skillIdx of skillAssignments[i] || []) {
      await prisma.employeeSkill.upsert({
        where: { employeeId_skillId: { employeeId: createdEmployees[i].id, skillId: skills[skillIdx].id } },
        update: {},
        create: { employeeId: createdEmployees[i].id, skillId: skills[skillIdx].id, level: levels[Math.floor(Math.random() * levels.length)] },
      });
    }
  }

  // Project
  const project = await prisma.project.create({
    data: { name: 'WorkZen Platform v2', description: 'Next generation HRMS platform', startDate: new Date('2024-10-01'), status: 'ACTIVE' },
  });
  for (let i = 0; i < 4; i++) {
    await prisma.projectAssignment.create({
      data: { projectId: project.id, employeeId: createdEmployees[i].id, role: i === 0 ? 'Tech Lead' : 'Developer' },
    });
  }

  // Workforce insights
  await prisma.workforceInsight.createMany({
    data: [
      { type: 'WORKLOAD_RISK', severity: 'HIGH', title: 'Engineering team overloaded', description: 'Engineering team has 40% more tasks than capacity this sprint.', employeeIds: [createdEmployees[0].id, createdEmployees[1].id], departmentId: engineering.id },
      { type: 'SKILL_GAP', severity: 'MEDIUM', title: 'Cloud skills gap in Engineering', description: 'Only 1 of 5 engineers has AWS expertise. Consider upskilling.', employeeIds: [], departmentId: engineering.id },
      { type: 'ATTENDANCE_RISK', severity: 'MEDIUM', title: 'Attendance dip in Marketing', description: 'Marketing department attendance dropped 15% this month.', employeeIds: [createdEmployees[8].id], departmentId: marketing.id },
    ],
  });

  console.log('✅ Seed complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
