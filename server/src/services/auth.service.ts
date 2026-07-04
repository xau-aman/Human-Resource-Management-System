import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { signToken } from '../middleware/auth.middleware';

export async function loginWithEmail(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, department: { select: { name: true } } } } },
  });

  if (!user) throw new AppError('Invalid email or password', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError('Invalid email or password', 401);

  const token = signToken({ id: user.id, email: user.email, role: user.role, employeeId: user.employee?.id });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      employee: user.employee,
    },
  };
}

export async function loginWithFirebase(firebaseUid: string, email: string) {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Auto-register Firebase users as EMPLOYEE
    user = await prisma.user.create({
      data: { email, passwordHash: '', role: 'EMPLOYEE', firebaseUid },
    });
  } else if (!user.firebaseUid) {
    user = await prisma.user.update({ where: { id: user.id }, data: { firebaseUid } });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { token, user: { id: user.id, email: user.email, role: user.role } };
}

export async function registerUser(email: string, password: string, role = 'EMPLOYEE') {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, role } });
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { token, user: { id: user.id, email: user.email, role: user.role } };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, role: true,
      employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, designation: true, department: { select: { name: true } } } },
    },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
}
