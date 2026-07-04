import type { Skill } from '../types';

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return payload.data as T;
}

export async function findSkillGaps(departmentId?: string): Promise<{ skill: string; gap: number; category: string; targetLevel: string }[]> {
  const params = new URLSearchParams();
  if (departmentId) params.set('department', departmentId);
  const data = await requestJson<{ gaps: { skill: string; gap: number; category: string; targetLevel: string }[] }>(`/api/v1/skills/gaps${params.toString() ? `?${params.toString()}` : ''}`);
  return data.gaps ?? [];
}

export async function getSkills(): Promise<Skill[]> {
  return requestJson<Skill[]>('/api/v1/skills');
}

export async function getSkillsMatrix() {
  return requestJson<{ employees: unknown[]; skills: Skill[] }>('/api/v1/skills/matrix');
}

export async function getSkillIntelligence(departmentId?: string) {
  const params = new URLSearchParams();
  if (departmentId) params.set('department', departmentId);
  return requestJson<{ gaps: unknown[]; coverage: { department: string; coverage: unknown[]; alerts: unknown[] }; recommendations: unknown[] }>(`/api/v1/skills/gaps${params.toString() ? `?${params.toString()}` : ''}`);
}

export async function getEmployeeSkillProfile(employeeId: string) {
  return requestJson(`/api/v1/skills/employee/${employeeId}`);
}

export async function recommendEmployeesForSkill(skillName: string, requiredLevel = 'ADVANCED') {
  const params = new URLSearchParams({ skill: skillName, level: requiredLevel });
  const data = await requestJson<{ recommendations: unknown[] }>(`/api/v1/skills/gaps?${params.toString()}`);
  return data.recommendations ?? [];
}
