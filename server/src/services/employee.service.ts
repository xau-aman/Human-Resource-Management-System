import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

interface GetEmployeesParams {
  page: number;
  limit: number;
  department?: string;
  status?: string;
  search?: string;
}

interface CreateEmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  designation: string;
  departmentId: string;
  joiningDate: string;
  managerId?: string;
}

const employeeInclude = {
  department: { select: { id: true, name: true } },
  manager: { select: { id: true, firstName: true, lastName: true } },
};

export async function getEmployees({ page, limit, department, status, search }: GetEmployeesParams) {
  const where = {
    ...(department && { department: { name: department } }),
    ...(status && { employmentStatus: status }),
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };
  const [employees, total] = await Promise.all([
    prisma.employee.findMany({ where, include: employeeInclude, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.employee.count({ where }),
  ]);
  return { employees, total };
}

export async function getEmployeeById(id: string) {
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: { ...employeeInclude, employeeSkills: { include: { skill: true } }, performanceReviews: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });
  if (!employee) throw new AppError('Employee not found', 404);
  return employee;
}

export async function createEmployee(data: CreateEmployeeInput) {
  const count = await prisma.employee.count();
  const employeeId = `WZ${String(1001 + count).padStart(4, '0')}`;
  return prisma.employee.create({
    data: { ...data, employeeId, joiningDate: new Date(data.joiningDate) },
    include: employeeInclude,
  });
}

export async function updateEmployee(id: string, data: Partial<CreateEmployeeInput>) {
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) throw new AppError('Employee not found', 404);
  return prisma.employee.update({ where: { id }, data, include: employeeInclude });
}

export async function deleteEmployee(id: string) {
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) throw new AppError('Employee not found', 404);
  return prisma.employee.update({ where: { id }, data: { employmentStatus: 'TERMINATED' } });
}
