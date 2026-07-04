import type { Skill } from '../types';
import { mockSkills, mockEmployeeSkills } from '../data/skills.data';
import { mockEmployees } from '../data/employees.data';

// TODO[SKILLS]: Replace with real API calls to /api/v1/skills

/**
 * Find skill gaps in the organization.
 * TODO[SKILLS]: Add skill gap analysis
 * @param departmentId - optional department filter
 * @returns array of skills with gap count
 */
export function findSkillGaps(_departmentId?: string): { skill: string; gap: number; category: string }[] {
  // Mock result - replace with real gap analysis
  return [
    { skill: 'AWS', gap: 4, category: 'Cloud' },
    { skill: 'Python', gap: 2, category: 'Backend' },
    { skill: 'Project Management', gap: 3, category: 'Management' },
  ];
}

export async function getSkills(): Promise<Skill[]> {
  return mockSkills;
}

export async function getSkillsMatrix() {
  const employees = mockEmployees.map(emp => ({
    ...emp,
    skills: mockEmployeeSkills[emp.id] || [],
  }));
  return { employees, skills: mockSkills };
}
