import prisma from '../config/prisma';

/**
 * Find skill gaps across the organization.
 * TODO[SKILLS]: Add skill gap analysis
 */
export function findSkillGaps(_departmentId?: string): { skill: string; gap: number }[] {
  return [
    { skill: 'AWS', gap: 4 },
    { skill: 'Python', gap: 2 },
    { skill: 'Project Management', gap: 3 },
  ];
}

export async function getSkills() {
  return prisma.skill.findMany({ orderBy: { name: 'asc' } });
}

export async function getSkillsMatrix() {
  const employees = await prisma.employee.findMany({
    where: { employmentStatus: 'ACTIVE' },
    select: { id: true, firstName: true, lastName: true, designation: true, department: { select: { name: true } }, employeeSkills: { include: { skill: true } } },
  });
  const skills = await prisma.skill.findMany({ orderBy: { name: 'asc' } });
  return { employees, skills };
}
