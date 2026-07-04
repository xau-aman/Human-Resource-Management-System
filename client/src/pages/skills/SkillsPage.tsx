import React, { useEffect, useState } from 'react';
import { getSkillsMatrix, findSkillGaps, getSkillIntelligence, getEmployeeSkillProfile } from '../../services/skills.service';
import type { Employee, Skill, EmployeeSkill } from '../../types';
import { PageHeader, LoadingState, Card, Badge } from '../../components/ui';
import { clsx } from 'clsx';

type EmployeeWithSkills = Employee & { skills: EmployeeSkill[] };

type IntelligenceAlert = { skill: string; message: string; severity: string };

type Recommendation = {
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  matchPercent: number;
  skillLevel: number;
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
  const [gaps, setGaps] = useState<{ skill: string; gap: number; category: string; targetLevel: string }[]>([]);
  const [alerts, setAlerts] = useState<IntelligenceAlert[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [employeeProfile, setEmployeeProfile] = useState<{ employee: Employee; skills: Array<{ skill: string; level: string; value: number }>; averageSkillLevel: number; coveragePercent: number } | null>(null);

  const handleProfileSelect = (employeeId: string) => {
    void getEmployeeSkillProfile(employeeId).then((profile) => {
      setEmployeeProfile(profile as typeof employeeProfile);
    });
  };

  useEffect(() => {
    Promise.all([getSkillsMatrix(), getSkillIntelligence('Engineering')]).then(([matrix, intelligence]) => {
      setEmployees(matrix.employees as EmployeeWithSkills[]);
      setSkills(matrix.skills);
      setGaps((intelligence.gaps as { skill: string; gap: number; category: string; targetLevel: string }[]) ?? []);
      setAlerts((intelligence.coverage?.alerts as IntelligenceAlert[]) ?? []);
      setRecommendations((intelligence.recommendations as Recommendation[]) ?? []);

      const firstRecommendation = (intelligence.recommendations as Recommendation[] | undefined)?.[0];
      if (firstRecommendation?.employeeId) {
        getEmployeeSkillProfile(firstRecommendation.employeeId).then((profile) => {
          setEmployeeProfile(profile as typeof employeeProfile);
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Skills Matrix" description="Employee skills and proficiency levels" />

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold text-gray-700 mb-2">Identified Skill Gaps</p>
          <div className="flex flex-wrap gap-2">
            {gaps.map((gap) => (
              <div key={gap.skill} className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
                <span className="text-sm font-medium text-red-700">{gap.skill}</span>
                <Badge variant="red">{gap.gap} needed</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-gray-700 mb-2">Skill Intelligence Alerts</p>
          <div className="space-y-2">
            {alerts.length > 0 ? alerts.map((alert) => (
              <div key={`${alert.skill}-${alert.message}`} className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                {alert.message}
              </div>
            )) : (
              <div className="text-sm text-gray-500">No alerts at the moment.</div>
            )}
          </div>
        </Card>
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <p className="text-sm font-semibold text-gray-700 mb-3">Recommended Employees for React</p>
          <div className="space-y-2">
            {recommendations.map((recommendation) => (
              <button
                key={recommendation.employeeId}
                type="button"
                onClick={() => handleProfileSelect(recommendation.employeeId)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-left hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{recommendation.employeeName}</p>
                  <p className="text-xs text-gray-400">{recommendation.designation}</p>
                </div>
                <Badge variant="green">{recommendation.matchPercent}% Match</Badge>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-gray-700 mb-3">Employee Skill Profile</p>
          {employeeProfile ? (
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-800">{employeeProfile.employee.firstName} {employeeProfile.employee.lastName}</p>
                <p className="text-sm text-gray-500">{employeeProfile.employee.designation}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                <p>Average skill level: <span className="font-semibold text-gray-800">{employeeProfile.averageSkillLevel.toFixed(1)}</span></p>
                <p>Coverage: <span className="font-semibold text-gray-800">{employeeProfile.coveragePercent}%</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                {employeeProfile.skills.map((skill) => (
                  <Badge key={skill.skill} variant="blue">{skill.skill}: {skill.level}</Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Select a recommended employee to inspect their profile.</div>
          )}
        </Card>
      </div>

      <Card padding={false} className="overflow-x-auto">
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
              <tr key={emp.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 sticky left-0 bg-white">
                  <p className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</p>
                  <p className="text-xs text-gray-400">{emp.department.name}</p>
                </td>
                {skills.map((skill) => {
                  const empSkill = emp.skills.find((entry) => entry.skillId === skill.id);
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
      </Card>
    </div>
  );
}
