const skillLevelValues: Record<string, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

const skillCatalog = [
  { id: 'skill-react', name: 'React', category: 'Frontend' },
  { id: 'skill-node', name: 'Node.js', category: 'Backend' },
  { id: 'skill-python', name: 'Python', category: 'Backend' },
  { id: 'skill-typescript', name: 'TypeScript', category: 'Frontend' },
  { id: 'skill-postgresql', name: 'PostgreSQL', category: 'Database' },
  { id: 'skill-leadership', name: 'Leadership', category: 'Soft Skills' },
  { id: 'skill-communication', name: 'Communication', category: 'Soft Skills' },
  { id: 'skill-project-management', name: 'Project Management', category: 'Management' },
  { id: 'skill-figma', name: 'Figma', category: 'Design' },
  { id: 'skill-aws', name: 'AWS', category: 'Cloud' },
];

const employeeProfiles = [
  {
    id: 'emp-1',
    employeeId: 'WZ1001',
    firstName: 'Arjun',
    lastName: 'Sharma',
    designation: 'Engineering Manager',
    department: 'Engineering',
    employmentStatus: 'ACTIVE',
    skills: [
      { skillId: 'skill-react', level: 'ADVANCED' },
      { skillId: 'skill-typescript', level: 'ADVANCED' },
      { skillId: 'skill-leadership', level: 'EXPERT' },
      { skillId: 'skill-aws', level: 'INTERMEDIATE' },
      { skillId: 'skill-python', level: 'ADVANCED' },
    ],
  },
  {
    id: 'emp-2',
    employeeId: 'WZ1002',
    firstName: 'Priya',
    lastName: 'Patel',
    designation: 'Senior Frontend Developer',
    department: 'Engineering',
    employmentStatus: 'ACTIVE',
    skills: [
      { skillId: 'skill-react', level: 'EXPERT' },
      { skillId: 'skill-typescript', level: 'ADVANCED' },
      { skillId: 'skill-node', level: 'INTERMEDIATE' },
      { skillId: 'skill-communication', level: 'INTERMEDIATE' },
    ],
  },
  {
    id: 'emp-3',
    employeeId: 'WZ1003',
    firstName: 'Rahul',
    lastName: 'Verma',
    designation: 'Backend Developer',
    department: 'Engineering',
    employmentStatus: 'ACTIVE',
    skills: [
      { skillId: 'skill-node', level: 'ADVANCED' },
      { skillId: 'skill-python', level: 'INTERMEDIATE' },
      { skillId: 'skill-postgresql', level: 'ADVANCED' },
      { skillId: 'skill-communication', level: 'INTERMEDIATE' },
    ],
  },
  {
    id: 'emp-4',
    employeeId: 'WZ1004',
    firstName: 'Sneha',
    lastName: 'Iyer',
    designation: 'Full Stack Developer',
    department: 'Engineering',
    employmentStatus: 'ACTIVE',
    skills: [
      { skillId: 'skill-react', level: 'ADVANCED' },
      { skillId: 'skill-node', level: 'ADVANCED' },
      { skillId: 'skill-typescript', level: 'ADVANCED' },
      { skillId: 'skill-communication', level: 'INTERMEDIATE' },
    ],
  },
  {
    id: 'emp-6',
    employeeId: 'WZ1006',
    firstName: 'Ananya',
    lastName: 'Reddy',
    designation: 'Lead Designer',
    department: 'Design',
    employmentStatus: 'ACTIVE',
    skills: [
      { skillId: 'skill-figma', level: 'EXPERT' },
      { skillId: 'skill-communication', level: 'ADVANCED' },
      { skillId: 'skill-leadership', level: 'INTERMEDIATE' },
    ],
  },
];

function getSkillNameById(skillId: string) {
  return skillCatalog.find((skill) => skill.id === skillId)?.name ?? skillId;
}

function normalizeSkillLevel(level: string) {
  return skillLevelValues[level] ?? 1;
}

function getEmployeeSkillValue(employee: (typeof employeeProfiles)[number], skillName: string) {
  const skill = employee.skills.find((entry) => getSkillNameById(entry.skillId) === skillName);
  return skill ? normalizeSkillLevel(skill.level) : 0;
}

function getTargetSkillLevel(level?: string) {
  return skillLevelValues[level ?? 'ADVANCED'] ?? 3;
}

function buildEmployeeMatrix() {
  return employeeProfiles.map((employee) => ({
    ...employee,
    skills: employee.skills.map((entry) => ({
      id: `${employee.id}-${entry.skillId}`,
      skillId: entry.skillId,
      skill: skillCatalog.find((skill) => skill.id === entry.skillId) ?? { id: entry.skillId, name: getSkillNameById(entry.skillId), category: 'General' },
      level: entry.level,
    })),
  }));
}

export function findSkillGaps(departmentId?: string) {
  const filteredEmployees = departmentId
    ? employeeProfiles.filter((employee) => employee.department === departmentId)
    : employeeProfiles;

  const requiredSkills = [
    { skill: 'React', level: 'ADVANCED', category: 'Frontend' },
    { skill: 'Node.js', level: 'INTERMEDIATE', category: 'Backend' },
    { skill: 'Communication', level: 'INTERMEDIATE', category: 'Soft Skills' },
  ];

  return requiredSkills.map((required) => {
    const requiredLevelValue = getTargetSkillLevel(required.level);
    const employeesMissingTarget = filteredEmployees.filter((employee) => getEmployeeSkillValue(employee, required.skill) < requiredLevelValue).length;
    return {
      skill: required.skill,
      gap: employeesMissingTarget,
      category: required.category,
      targetLevel: required.level,
    };
  });
}

export function getEmployeeSkillProfile(employeeId: string) {
  const employee = employeeProfiles.find((entry) => entry.id === employeeId || entry.employeeId === employeeId);
  if (!employee) return null;

  const skills = employee.skills.map((entry) => ({
    skill: getSkillNameById(entry.skillId),
    level: entry.level,
    value: normalizeSkillLevel(entry.level),
  }));

  const averageSkillLevel = skills.length > 0 ? skills.reduce((sum, skill) => sum + skill.value, 0) / skills.length : 0;

  return {
    employee,
    skills,
    averageSkillLevel,
    coveragePercent: Math.round((averageSkillLevel / 4) * 100),
  };
}

export function getDepartmentSkillCoverage(departmentName?: string) {
  const department = departmentName ?? 'Engineering';
  const filteredEmployees = employeeProfiles.filter((employee) => employee.department === department);

  const coverage = [
    { skill: 'Python', targetLevel: 'ADVANCED', count: filteredEmployees.filter((employee) => getEmployeeSkillValue(employee, 'Python') >= getTargetSkillLevel('ADVANCED')).length, total: filteredEmployees.length },
    { skill: 'Leadership', targetLevel: 'INTERMEDIATE', count: filteredEmployees.filter((employee) => getEmployeeSkillValue(employee, 'Leadership') >= getTargetSkillLevel('INTERMEDIATE')).length, total: filteredEmployees.length },
  ].map((entry) => ({
    ...entry,
    coveragePercent: filteredEmployees.length > 0 ? Math.round((entry.count / entry.total) * 100) : 0,
  }));

  const alerts = coverage
    .filter((entry) => entry.coveragePercent < 25 || (entry.skill === 'Python' && entry.count <= 1))
    .map((entry) => ({
      skill: entry.skill,
      message: entry.skill === 'Python'
        ? `${department} has only ${entry.count} employee(s) with Advanced Python skills.`
        : `${entry.skill} coverage is below 25%.`,
      severity: entry.skill === 'Python' ? 'HIGH' : 'MEDIUM',
    }));

  return { department, coverage, alerts };
}

export function recommendEmployeesForSkill(skillName: string, requiredLevel = 'ADVANCED') {
  const targetLevelValue = getTargetSkillLevel(requiredLevel);
  const scoredEmployees = employeeProfiles.map((employee) => {
    const skillValue = getEmployeeSkillValue(employee, skillName);
    const matchPercent = skillValue === 0 ? 0 : Math.min(100, Math.round((skillValue / targetLevelValue) * 100));
    return {
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: employee.department,
      designation: employee.designation,
      matchPercent,
      skillLevel: skillValue,
    };
  });

  return scoredEmployees.sort((left, right) => right.matchPercent - left.matchPercent).slice(0, 5);
}

export async function getSkills() {
  return skillCatalog;
}

export async function getSkillsMatrix() {
  return { employees: buildEmployeeMatrix(), skills: skillCatalog };
}

export async function getSkillIntelligence(departmentName?: string, skillName?: string, requiredLevel?: string) {
  const gaps = findSkillGaps(departmentName);
  const coverage = getDepartmentSkillCoverage(departmentName);
  const recommendations = skillName
    ? recommendEmployeesForSkill(skillName, requiredLevel)
    : recommendEmployeesForSkill('React', 'ADVANCED');

  return { gaps, coverage, recommendations };
}

export async function upsertEmployeeSkill(employeeId: string, skillName: string, level: string) {
  const employee = employeeProfiles.find((entry) => entry.id === employeeId || entry.employeeId === employeeId);
  if (!employee) return null;

  const existingSkill = employee.skills.find((entry) => getSkillNameById(entry.skillId) === skillName);
  if (existingSkill) {
    existingSkill.level = level as keyof typeof skillLevelValues;
  } else {
    const matchingSkill = skillCatalog.find((skill) => skill.name === skillName);
    if (matchingSkill) {
      employee.skills.push({ skillId: matchingSkill.id, level: level as keyof typeof skillLevelValues });
    }
  }

  return getEmployeeSkillProfile(employee.id);
}
