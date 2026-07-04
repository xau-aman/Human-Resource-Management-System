import React, { useEffect, useState } from 'react';
import { getSkillsMatrix, getSkillIntelligence, getEmployeeSkillProfile } from '../../services/skills.service';
import type { Employee, Skill, EmployeeSkill } from '../../types';
import { PageHeader, LoadingState, Card, Badge } from '../../components/ui';
import { clsx } from 'clsx';

type EmployeeWithSkills = Employee & { skills: EmployeeSkill[] };

type SkillProfile = {
  employee: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    designation: string;
    employmentStatus: string;
    department: { id: string; name: string };
    joiningDate: string;
  };
  summary: {
    totalSkills: number;
    averageLevelValue: number;
    profileScore: number;
    strengths: Array<{ name: string; level: string }>;
    developmentAreas: Array<{ name: string; level: string }>;
  };
  skills: Array<{ id: string; name: string; category: string; level: string; levelValue: number }>;
};

const levelColors: Record<string, string> = {
  BEGINNER: 'bg-gray-100 text-gray-600',
  INTERMEDIATE: 'bg-blue-100 text-blue-700',
  ADVANCED: 'bg-purple-100 text-purple-700',
  EXPERT: 'bg-emerald-100 text-emerald-700',
};

const levelShort: Record<string, string> = {
  BEGINNER: 'B', INTERMEDIATE: 'I', ADVANCED: 'A', EXPERT: 'E',
};

export default function SkillsPage() {
  const [employees, setEmployees] = useState<EmployeeWithSkills[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gaps, setGaps] = useState<Array<{ skill: string; gap: number; category: string; coveragePercent: number }>>([]);
  const [alerts, setAlerts] = useState<Array<{ title: string; detail: string }>>([]);
  const [recommendations, setRecommendations] = useState<Array<{ employeeName: string; designation: string; department: string; matchPercent: number; matchedSkills: Array<{ skillName: string; score: number }> }>>([]);
  const [selectedProfile, setSelectedProfile] = useState<SkillProfile | null>(null);

  const normalizeEmployees = (items: Array<Record<string, unknown>> = []) =>
    items.map((emp) => ({
      ...(emp as unknown as EmployeeWithSkills),
      department: (emp.department as { id?: string; name?: string } | undefined) ?? { id: '', name: 'Unknown' },
      skills: Array.isArray((emp as unknown as EmployeeWithSkills).skills) ? (emp as unknown as EmployeeWithSkills).skills : [],
    }));

  const normalizeSkills = (items: Array<Record<string, unknown>> = []) =>
    items.map((skill) => ({
      id: String(skill.id ?? ''),
      name: String(skill.name ?? 'Unknown'),
      category: String(skill.category ?? 'General'),
    }));

  const normalizeProfile = (profile: Record<string, unknown> | null | undefined): SkillProfile | null => {
    if (!profile || typeof profile !== 'object') return null;

    const rawProfile = profile as Record<string, unknown>;
    const employee = (rawProfile.employee as Record<string, unknown> | undefined) ?? {};
    const summary = (rawProfile.summary as Record<string, unknown> | undefined) ?? {};
    const skills = Array.isArray(rawProfile.skills) ? (rawProfile.skills as Array<Record<string, unknown>>) : [];

    return {
      employee: {
        id: String((employee.id as string | undefined) ?? ''),
        employeeId: String((employee.employeeId as string | undefined) ?? ''),
        firstName: String((employee.firstName as string | undefined) ?? 'Unknown'),
        lastName: String((employee.lastName as string | undefined) ?? ''),
        email: String((employee.email as string | undefined) ?? ''),
        designation: String((employee.designation as string | undefined) ?? 'Unknown'),
        employmentStatus: String((employee.employmentStatus as string | undefined) ?? 'ACTIVE'),
        department: {
          id: String(((employee.department as Record<string, unknown> | undefined)?.id as string | undefined) ?? ''),
          name: String(((employee.department as Record<string, unknown> | undefined)?.name as string | undefined) ?? 'Unknown'),
        },
        joiningDate: String((employee.joiningDate as string | undefined) ?? ''),
      },
      summary: {
        totalSkills: Number((summary.totalSkills as number | undefined) ?? skills.length ?? 0),
        averageLevelValue: Number((summary.averageLevelValue as number | undefined) ?? 0),
        profileScore: Number((summary.profileScore as number | undefined) ?? 0),
        strengths: Array.isArray(summary.strengths)
          ? (summary.strengths as Array<Record<string, unknown>>).map((skill) => ({
              name: String((skill.name as string | undefined) ?? 'Unknown'),
              level: String((skill.level as string | undefined) ?? 'BEGINNER'),
            }))
          : [],
        developmentAreas: Array.isArray(summary.developmentAreas)
          ? (summary.developmentAreas as Array<Record<string, unknown>>).map((skill) => ({
              name: String((skill.name as string | undefined) ?? 'Unknown'),
              level: String((skill.level as string | undefined) ?? 'BEGINNER'),
            }))
          : [],
      },
      skills: skills.map((skill) => ({
        id: String((skill.id as string | undefined) ?? ''),
        name: String((skill.name as string | undefined) ?? 'Unknown'),
        category: String((skill.category as string | undefined) ?? 'General'),
        level: String((skill.level as string | undefined) ?? 'BEGINNER'),
        levelValue: Number((skill.levelValue as number | undefined) ?? 0),
      })),
    };
  };

  const handleSelectEmployee = async (employeeId: string) => {
    try {
      const profile = await getEmployeeSkillProfile(employeeId);
      setSelectedProfile(normalizeProfile(profile as Record<string, unknown> | null));
    } catch {
      setSelectedProfile(null);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [matrixData, intelligence] = await Promise.all([
          getSkillsMatrix().catch(() => ({ employees: [], skills: [] })),
          getSkillIntelligence().catch(() => ({ gaps: [], alerts: [], recommendations: [], departmentCoverage: { department: 'Unknown', totalEmployees: 0, skillCoverage: [] } })),
        ]);

        if (!isMounted) return;

        const safeEmployees = normalizeEmployees((matrixData?.employees as Array<Record<string, unknown>>) ?? []);
        const safeSkills = normalizeSkills((matrixData?.skills as Array<Record<string, unknown>>) ?? []);

        setEmployees(safeEmployees as unknown as EmployeeWithSkills[]);
        setSkills(safeSkills as unknown as Skill[]);
        setGaps((intelligence?.gaps ?? []) as Array<{ skill: string; gap: number; category: string; coveragePercent: number }>);
        setAlerts((intelligence?.alerts ?? []) as Array<{ title: string; detail: string }>);
        setRecommendations((intelligence?.recommendations ?? []) as Array<{ employeeName: string; designation: string; department: string; matchPercent: number; matchedSkills: Array<{ skillName: string; score: number }> }>);

        if (safeEmployees[0]?.id) {
          const profile = await getEmployeeSkillProfile(safeEmployees[0].id).catch(() => null);
          if (isMounted) {
            setSelectedProfile(profile as SkillProfile | null);
          }
        }
      } catch {
        if (isMounted) {
          setError('Unable to load skill intelligence right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Skills Matrix" description="Employee skills and proficiency levels" />
        <Card>
          <p className="text-sm font-semibold text-gray-700">Unable to load skill intelligence</p>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Skills Matrix" description="Employee skills and proficiency levels" />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <p className="text-sm font-semibold text-gray-700 mb-2">Skill Intelligence</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {gaps.map((gap) => (
              <div key={gap.skill} className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
                <span className="text-sm font-medium text-red-700">{gap.skill}</span>
                <Badge variant="red">{gap.gap} gap</Badge>
              </div>
            ))}
          </div>
          {alerts.length > 0 ? (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.title} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  <p className="font-semibold">{alert.title}</p>
                  <p className="text-xs text-amber-700">{alert.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No special coverage alerts at the moment.</p>
          )}
        </Card>

        <Card>
          <p className="text-sm font-semibold text-gray-700 mb-3">Recommended Matches</p>
          <div className="space-y-3">
            {recommendations.map((recommendation) => (
              <div key={recommendation.employeeName} className="rounded-lg border border-gray-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{recommendation.employeeName}</p>
                    <p className="text-xs text-gray-500">{recommendation.designation} · {recommendation.department}</p>
                  </div>
                  <Badge variant="green">{recommendation.matchPercent}% Match</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {recommendation.matchedSkills.map((skill) => (
                    <span key={skill.skillName} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700">
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-700">Employee Skill Profile</p>
            <p className="text-xs text-gray-500">Select an employee row to inspect their profile</p>
          </div>
          {selectedProfile && (
            <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              {selectedProfile.summary.profileScore}% profile strength
            </div>
          )}
        </div>
        {selectedProfile ? (
          <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="font-semibold text-gray-900">{selectedProfile.employee.firstName} {selectedProfile.employee.lastName}</p>
              <p className="text-sm text-gray-500">{selectedProfile.employee.designation} · {selectedProfile.employee.department.name}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedProfile.skills.map((skill) => (
                  <span key={skill.id} className={clsx('rounded-full px-2.5 py-1 text-xs font-medium', levelColors[skill.level] || 'bg-gray-100 text-gray-600')}>
                    {skill.name} · {skill.level}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Summary</p>
              <p className="mt-2 text-sm text-gray-700">{selectedProfile.summary.totalSkills} skills mapped · avg level {selectedProfile.summary.averageLevelValue.toFixed(1)} / 4</p>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs font-semibold text-gray-500">Strengths</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedProfile.summary.strengths.map((skill) => (
                      <Badge key={skill.name} variant="green">{skill.name}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Development areas</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedProfile.summary.developmentAreas.map((skill) => (
                      <Badge key={skill.name} variant="gray">{skill.name}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Select an employee to see their skill profile.</p>
        )}
      </Card>

      <Card padding={false} className="overflow-x-auto">
        {employees.length === 0 ? (
          <div className="px-4 py-6 text-sm text-gray-500">No employee skill data is available yet.</div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide sticky left-0 bg-white min-w-40">Employee</th>
                  {skills.map((skill) => (
                    <th key={skill.id} className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-24">
                      <div>{skill.name}</div>
                      <div className="text-gray-400 font-normal normal-case">{skill.category}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {employees.map((emp) => (
                  <tr key={emp.id} className="cursor-pointer hover:bg-gray-50/50" onClick={() => void handleSelectEmployee(emp.id)}>
                    <td className="px-4 py-3 sticky left-0 bg-white">
                      <p className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</p>
                      <p className="text-xs text-gray-400">{emp.department.name}</p>
                    </td>
                    {skills.map((skill) => {
                      const empSkill = emp.skills.find((es) => es.skillId === skill.id);
                      return (
                        <td key={skill.id} className="px-3 py-3 text-center">
                          {empSkill ? (
                            <span className={clsx('inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold', levelColors[empSkill.level])}>
                              {levelShort[empSkill.level]}
                            </span>
                          ) : (
                            <span className="text-gray-200">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center gap-4 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              {Object.entries(levelColors).map(([level, cls]) => (
                <div key={level} className="flex items-center gap-1.5">
                  <span className={clsx('w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center', cls)}>{levelShort[level]}</span>
                  <span className="text-xs text-gray-500">{level.charAt(0) + level.slice(1).toLowerCase()}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
