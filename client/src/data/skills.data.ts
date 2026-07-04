import type { Skill, EmployeeSkill } from '../types';

export const mockSkills: Skill[] = [
  { id: 's1', name: 'React', category: 'Frontend' },
  { id: 's2', name: 'Node.js', category: 'Backend' },
  { id: 's3', name: 'Python', category: 'Backend' },
  { id: 's4', name: 'TypeScript', category: 'Frontend' },
  { id: 's5', name: 'PostgreSQL', category: 'Database' },
  { id: 's6', name: 'Leadership', category: 'Soft Skills' },
  { id: 's7', name: 'Communication', category: 'Soft Skills' },
  { id: 's8', name: 'Project Management', category: 'Management' },
  { id: 's9', name: 'Figma', category: 'Design' },
  { id: 's10', name: 'AWS', category: 'Cloud' },
];

export const mockEmployeeSkills: Record<string, EmployeeSkill[]> = {
  '1': [
    { id: 'es1', skillId: 's1', skill: mockSkills[0], level: 'ADVANCED' },
    { id: 'es2', skillId: 's4', skill: mockSkills[3], level: 'ADVANCED' },
    { id: 'es3', skillId: 's6', skill: mockSkills[5], level: 'EXPERT' },
    { id: 'es4', skillId: 's10', skill: mockSkills[9], level: 'INTERMEDIATE' },
  ],
  '2': [
    { id: 'es5', skillId: 's1', skill: mockSkills[0], level: 'EXPERT' },
    { id: 'es6', skillId: 's4', skill: mockSkills[3], level: 'ADVANCED' },
    { id: 'es7', skillId: 's2', skill: mockSkills[1], level: 'INTERMEDIATE' },
  ],
  '3': [
    { id: 'es8', skillId: 's2', skill: mockSkills[1], level: 'ADVANCED' },
    { id: 'es9', skillId: 's3', skill: mockSkills[2], level: 'INTERMEDIATE' },
    { id: 'es10', skillId: 's5', skill: mockSkills[4], level: 'ADVANCED' },
  ],
  '6': [
    { id: 'es11', skillId: 's9', skill: mockSkills[8], level: 'EXPERT' },
    { id: 'es12', skillId: 's7', skill: mockSkills[6], level: 'ADVANCED' },
    { id: 'es13', skillId: 's6', skill: mockSkills[5], level: 'INTERMEDIATE' },
  ],
};
