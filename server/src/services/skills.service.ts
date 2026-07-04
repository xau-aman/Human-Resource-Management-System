import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

interface RequiredSkillInput {
  skillName: string;
  level: SkillLevel;
}

const skillLevelValues: Record<SkillLevel, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

function normalizeSkillName(value: string): string {
  return value.trim().toLowerCase();
}

function getNormalizedLevel(level?: string): SkillLevel | null {
  if (!level) return null;
  const normalized = level.toUpperCase();
  return normalized in skillLevelValues ? (normalized as SkillLevel) : null;
}

function getLevelScore(level?: SkillLevel | null): number {
  if (!level) return 0;
  return skillLevelValues[level] || 0;
}

function getSkillMatchScore(employeeLevel?: SkillLevel | null, requiredLevel?: SkillLevel | null): number {
  const employeeScore = getLevelScore(employeeLevel);
  const requiredScore = getLevelScore(requiredLevel);
  if (!requiredScore) return 0;
  return Math.min(employeeScore / requiredScore, 1);
}

function buildEmployeeSkillPayload(employee: any) {
  return {
    id: employee.id,
    employeeId: employee.employeeId,
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    designation: employee.designation,
    joiningDate: employee.joiningDate.toISOString(),
    employmentStatus: employee.employmentStatus,
    department: employee.department,
    skills: employee.employeeSkills.map((employeeSkill: any) => ({
      id: employeeSkill.id,
      skillId: employeeSkill.skillId,
      level: employeeSkill.level,
      skill: {
        id: employeeSkill.skill.id,
        name: employeeSkill.skill.name,
        category: employeeSkill.skill.category,
      },
    })),
  };
}

export async function findSkillGaps(departmentName?: string) {
  const employees = await prisma.employee.findMany({
    where: {
      employmentStatus: 'ACTIVE',
      ...(departmentName ? { department: { name: { equals: departmentName, mode: 'insensitive' } } } : {}),
    },
    select: {
      id: true,
      employeeSkills: { include: { skill: true } },
    },
  });

  const skills = await prisma.skill.findMany({ orderBy: { name: 'asc' } });
  const totalEmployees = employees.length || 1;

  return skills
    .map((skill) => {
      const advancedCount = employees.filter((employee) =>
        employee.employeeSkills.some(
          (employeeSkill) =>
            normalizeSkillName(employeeSkill.skill.name) === normalizeSkillName(skill.name) && getLevelScore(employeeSkill.level as SkillLevel) >= 3
        )
      ).length;

      return {
        skill: skill.name,
        category: skill.category,
        gap: Math.max(0, totalEmployees - advancedCount),
        coveragePercent: Math.round((advancedCount / totalEmployees) * 100),
        advancedCount,
        totalEmployees,
      };
    })
    .filter((item) => item.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 8);
}

export async function getDepartmentSkillCoverage(departmentName?: string, skillName?: string) {
  const employees = await prisma.employee.findMany({
    where: {
      employmentStatus: 'ACTIVE',
      ...(departmentName ? { department: { name: { equals: departmentName, mode: 'insensitive' } } } : {}),
    },
    select: {
      id: true,
      employeeSkills: { include: { skill: true } },
    },
  });

  const skills = await prisma.skill.findMany({ orderBy: { name: 'asc' } });
  const totalEmployees = employees.length || 1;
  const skillCoverage = skills.map((skill) => {
    const advancedCount = employees.filter((employee) =>
      employee.employeeSkills.some(
        (employeeSkill) =>
          normalizeSkillName(employeeSkill.skill.name) === normalizeSkillName(skill.name) && getLevelScore(employeeSkill.level as SkillLevel) >= 3
      )
    ).length;

    return {
      skill: skill.name,
      category: skill.category,
      advancedCount,
      totalEmployees,
      coveragePercent: Math.round((advancedCount / totalEmployees) * 100),
    };
  });

  if (skillName) {
    const matchingSkill = skillCoverage.find((item) => normalizeSkillName(item.skill) === normalizeSkillName(skillName));
    return {
      department: departmentName || 'All Departments',
      targetedSkill: skillName,
      coverage: matchingSkill || null,
    };
  }

  return {
    department: departmentName || 'All Departments',
    totalEmployees,
    skillCoverage,
  };
}

export async function getEmployeeSkillProfile(employeeId: string) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: {
      id: true,
      employeeId: true,
      firstName: true,
      lastName: true,
      email: true,
      designation: true,
      joiningDate: true,
      employmentStatus: true,
      department: { select: { id: true, name: true } },
      employeeSkills: { include: { skill: true }, orderBy: { skill: { name: 'asc' } } },
    },
  });

  if (!employee) throw new AppError('Employee not found', 404);

  const skills = employee.employeeSkills.map((employeeSkill: any) => ({
    id: employeeSkill.skill.id,
    name: employeeSkill.skill.name,
    category: employeeSkill.skill.category,
    level: employeeSkill.level,
    levelValue: getLevelScore(employeeSkill.level as SkillLevel),
  }));

  const averageLevelValue = skills.length ? skills.reduce((sum, skill) => sum + skill.levelValue, 0) / skills.length : 0;

  return {
    employee: {
      id: employee.id,
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      designation: employee.designation,
      employmentStatus: employee.employmentStatus,
      department: employee.department,
      joiningDate: employee.joiningDate.toISOString(),
    },
    skills,
    summary: {
      totalSkills: skills.length,
      averageLevelValue,
      profileScore: Math.round((averageLevelValue / 4) * 100),
      strengths: skills.filter((skill) => skill.levelValue >= 3),
      developmentAreas: skills.filter((skill) => skill.levelValue <= 2),
    },
  };
}

export async function recommendEmployeesForSkill(requiredSkills: RequiredSkillInput[] = []) {
  const employees = await prisma.employee.findMany({
    where: { employmentStatus: 'ACTIVE' },
    select: {
      id: true,
      employeeId: true,
      firstName: true,
      lastName: true,
      designation: true,
      department: { select: { name: true } },
      employeeSkills: { include: { skill: true } },
    },
  });

  if (!requiredSkills.length) {
    return [];
  }

  return employees
    .map((employee) => {
      const scores = requiredSkills.map((requiredSkill) => {
        const employeeSkill = employee.employeeSkills.find((item: any) =>
          normalizeSkillName(item.skill.name) === normalizeSkillName(requiredSkill.skillName)
        );
        const score = getSkillMatchScore(employeeSkill?.level as SkillLevel | undefined, requiredSkill.level);
        return { skillName: requiredSkill.skillName, score };
      });

      const averageScore = scores.reduce((sum, item) => sum + item.score, 0) / scores.length;

      return {
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        designation: employee.designation,
        department: employee.department?.name || 'Unknown',
        matchPercent: Math.round(averageScore * 100),
        matchedSkills: scores.filter((item) => item.score > 0),
      };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 5);
}

export async function getSkillIntelligence(departmentName?: string, requiredSkills: RequiredSkillInput[] = []) {
  const [gaps, departmentCoverage, recommendations] = await Promise.all([
    findSkillGaps(departmentName),
    getDepartmentSkillCoverage(departmentName),
    recommendEmployeesForSkill(requiredSkills.length ? requiredSkills : [
      { skillName: 'React', level: 'ADVANCED' },
      { skillName: 'Node.js', level: 'INTERMEDIATE' },
      { skillName: 'Communication', level: 'INTERMEDIATE' },
    ]),
  ]);

  const alerts: Array<{ title: string; detail: string }> = [];
  const engineeringCoverage = departmentCoverage.skillCoverage?.find((item) => normalizeSkillName(item.skill) === 'python');
  if (departmentName && normalizeSkillName(departmentName) === 'engineering' && engineeringCoverage && engineeringCoverage.advancedCount <= 1) {
    alerts.push({
      title: 'Engineering Python coverage is limited',
      detail: `Engineering has only ${engineeringCoverage.advancedCount} employee with Advanced or higher Python skills.`,
    });
  }

  const leadershipCoverage = departmentCoverage.skillCoverage?.find((item) => normalizeSkillName(item.skill) === 'leadership');
  if (leadershipCoverage && leadershipCoverage.coveragePercent < 25) {
    alerts.push({
      title: 'Leadership skill coverage is below 25%',
      detail: `Current leadership coverage is ${leadershipCoverage.coveragePercent}% across the selected group.`,
    });
  }

  return {
    gaps,
    alerts,
    recommendations,
    departmentCoverage,
  };
}

export async function addEmployeeSkill(employeeId: string, data: { skillName: string; level: string }) {
  const normalizedLevel = getNormalizedLevel(data.level);
  if (!normalizedLevel) {
    throw new AppError('Invalid skill level', 400);
  }

  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  let skill = await prisma.skill.findFirst({ where: { name: { equals: data.skillName, mode: 'insensitive' } } });
  if (!skill) {
    skill = await prisma.skill.create({ data: { name: data.skillName, category: 'General' } });
  }

  const existingSkill = await prisma.employeeSkill.findUnique({
    where: { employeeId_skillId: { employeeId, skillId: skill.id } },
  });

  if (existingSkill) {
    return prisma.employeeSkill.update({
      where: { id: existingSkill.id },
      data: { level: normalizedLevel },
      include: { skill: true },
    });
  }

  return prisma.employeeSkill.create({
    data: { employeeId, skillId: skill.id, level: normalizedLevel },
    include: { skill: true },
  });
}

export async function getSkills() {
  return prisma.skill.findMany({ orderBy: { name: 'asc' } });
}

export async function getSkillsMatrix() {
  const employees = await prisma.employee.findMany({
    where: { employmentStatus: 'ACTIVE' },
    select: {
      id: true,
      employeeId: true,
      firstName: true,
      lastName: true,
      email: true,
      designation: true,
      joiningDate: true,
      employmentStatus: true,
      department: { select: { id: true, name: true } },
      employeeSkills: { include: { skill: true } },
    },
    orderBy: { firstName: 'asc' },
  });

  const skills = await prisma.skill.findMany({ orderBy: { name: 'asc' } });
  return {
    employees: employees.map(buildEmployeeSkillPayload),
    skills,
  };
}
