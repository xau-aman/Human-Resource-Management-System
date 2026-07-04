import React, { useEffect, useState } from 'react';
import { getSkillsMatrix, findSkillGaps } from '../../services/skills.service';
import type { Employee, Skill, EmployeeSkill } from '../../types';
import { PageHeader, LoadingState, Card, Badge } from '../../components/ui';
import { clsx } from 'clsx';

// TODO[SKILLS]: Add skill gap analysis

type EmployeeWithSkills = Employee & { skills: EmployeeSkill[] };

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
  const gaps = findSkillGaps();

  useEffect(() => {
    getSkillsMatrix().then(({ employees: e, skills: s }) => {
      setEmployees(e as EmployeeWithSkills[]);
      setSkills(s);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Skills Matrix" description="Employee skills and proficiency levels" />

      {/* Skill gaps */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-700 mb-2">Identified Skill Gaps</p>
        <div className="flex flex-wrap gap-2">
          {gaps.map(g => (
            <div key={g.skill} className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
              <span className="text-sm font-medium text-red-700">{g.skill}</span>
              <Badge variant="red">{g.gap} needed</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Matrix */}
      <Card padding={false} className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide sticky left-0 bg-white min-w-40">Employee</th>
              {skills.map(s => (
                <th key={s.id} className="px-3 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-24">
                  <div>{s.name}</div>
                  <div className="text-gray-400 font-normal normal-case">{s.category}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 sticky left-0 bg-white">
                  <p className="font-medium text-gray-900">{emp.firstName} {emp.lastName}</p>
                  <p className="text-xs text-gray-400">{emp.department.name}</p>
                </td>
                {skills.map(skill => {
                  const empSkill = emp.skills.find(es => es.skillId === skill.id);
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
