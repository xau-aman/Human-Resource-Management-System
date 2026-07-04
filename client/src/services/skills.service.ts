import type { Skill, EmployeeSkill } from '../types';
import { mockEmployees } from '../data/employees.data';
import { mockSkills, mockEmployeeSkills } from '../data/skills.data';

interface SkillGapInsight {
  skill: string;
  gap: number;
  category: string;
  coveragePercent: number;
  advancedCount: number;
  totalEmployees: number;
}

interface SkillIntelligenceResponse {
  gaps: SkillGapInsight[];
  alerts: Array<{ title: string; detail: string }>;
  recommendations: Array<{
    employeeId: string;
    employeeName: string;
    designation: string;
    department: string;
    matchPercent: number;
    matchedSkills: Array<{ skillName: string; score: number }>;
  }>;
  departmentCoverage: {
    department: string;
    totalEmployees: number;
    skillCoverage: Array<{
      skill: string;
      category: string;
      advancedCount: number;
      totalEmployees: number;
      coveragePercent: number;
    }>;
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(path, init);
    const payload = await response.json();
    if (!payload?.success) {
      throw new Error(payload?.message || 'Request failed');
    }
    return payload.data as T;
  } catch {
    if (path.includes('/api/v1/skills/gaps')) {
      return {
        gaps: [
          { skill: 'AWS', gap: 4, category: 'Cloud', coveragePercent: 20, advancedCount: 1, totalEmployees: 5 },
          { skill: 'Python', gap: 2, category: 'Backend', coveragePercent: 40, advancedCount: 2, totalEmployees: 5 },
          { skill: 'Project Management', gap: 3, category: 'Management', coveragePercent: 20, advancedCount: 1, totalEmployees: 5 },
        ],
        alerts: [
          { title: 'Engineering department has only 1 employee with Advanced Python skills.', detail: 'Consider upskilling the team.' },
          { title: 'Leadership skill coverage is below 25%.', detail: 'Broaden leadership readiness across the organization.' },
        ],
        recommendations: [
          { employeeId: '1', employeeName: 'Ayush Sharma', designation: 'Engineering Manager', department: 'Engineering', matchPercent: 91, matchedSkills: [{ skillName: 'React', score: 1 }, { skillName: 'Node.js', score: 0.5 }, { skillName: 'Communication', score: 0.75 }] },
          { employeeId: '2', employeeName: 'Aman Kumar', designation: 'Senior Frontend Developer', department: 'Engineering', matchPercent: 76, matchedSkills: [{ skillName: 'React', score: 1 }, { skillName: 'Node.js', score: 0.25 }, { skillName: 'Communication', score: 0.5 }] },
          { employeeId: '3', employeeName: 'Rahul Verma', designation: 'Backend Developer', department: 'Engineering', matchPercent: 54, matchedSkills: [{ skillName: 'React', score: 0.25 }, { skillName: 'Node.js', score: 1 }, { skillName: 'Communication', score: 0.25 }] },
        ],
        departmentCoverage: {
          department: 'Engineering',
          totalEmployees: 5,
          skillCoverage: [
            { skill: 'Python', category: 'Backend', advancedCount: 1, totalEmployees: 5, coveragePercent: 20 },
            { skill: 'Leadership', category: 'Soft Skills', advancedCount: 1, totalEmployees: 5, coveragePercent: 20 },
          ],
        },
      } as T;
    }

    if (path.includes('/api/v1/skills/employee/')) {
      const employeeId = path.split('/').pop() || '1';
      const employee = mockEmployees.find((item) => item.id === employeeId);
      return {
        employee: {
          id: employee?.id || '1',
          employeeId: employee?.employeeId || 'WZ1001',
          firstName: employee?.firstName || 'Ayush',
          lastName: employee?.lastName || 'Sharma',
          email: employee?.email || 'ayush@example.com',
          designation: employee?.designation || 'Engineering Manager',
          employmentStatus: employee?.employmentStatus || 'ACTIVE',
          department: employee?.department || { id: 'd1', name: 'Engineering' },
          joiningDate: employee?.joiningDate || '2024-01-01',
        },
        skills: [
          { id: 's1', name: 'React', category: 'Frontend', level: 'ADVANCED', levelValue: 3 },
          { id: 's2', name: 'Node.js', category: 'Backend', level: 'INTERMEDIATE', levelValue: 2 },
          { id: 's3', name: 'Communication', category: 'Soft Skills', level: 'INTERMEDIATE', levelValue: 2 },
        ],
        summary: {
          totalSkills: 3,
          averageLevelValue: 2.3,
          profileScore: 58,
          strengths: [{ name: 'React', level: 'ADVANCED' }],
          developmentAreas: [{ name: 'Communication', level: 'INTERMEDIATE' }],
        },
      } as T;
    }

    if (path.includes('/api/v1/skills/matrix')) {
      return {
        employees: mockEmployees.map((emp) => ({
          ...emp,
          skills: mockEmployeeSkills[emp.id] || [],
        })),
        skills: mockSkills,
      } as T;
    }

    if (path.includes('/api/v1/skills')) {
      return mockSkills as T;
    }

    throw new Error('Request failed');
  }
}

export async function findSkillGaps(_departmentId?: string): Promise<SkillGapInsight[]> {
  const intelligence = await request<SkillIntelligenceResponse>('/api/v1/skills/gaps');
  return intelligence.gaps;
}

export async function getSkillIntelligence(): Promise<SkillIntelligenceResponse> {
  return request<SkillIntelligenceResponse>('/api/v1/skills/gaps');
}

export async function getEmployeeSkillProfile(employeeId: string) {
  return request(`/api/v1/skills/employee/${employeeId}`);
}

export async function addEmployeeSkill(employeeId: string, payload: { skillName: string; level: string }) {
  return request(`/api/v1/skills/employee/${employeeId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function getSkills(): Promise<Skill[]> {
  return request<Skill[]>('/api/v1/skills');
}

export async function getSkillsMatrix() {
  return request<{ employees: Array<{ id: string; skills: EmployeeSkill[]; [key: string]: unknown }>; skills: Skill[] }>('/api/v1/skills/matrix');
}
