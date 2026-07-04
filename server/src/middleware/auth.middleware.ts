import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { verifyFirebaseToken } from '../config/firebase';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { AppError } from '../utils/AppError';
import prisma from '../config/prisma';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string; employeeId?: string };
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  employeeId?: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as jwt.SignOptions);
}

export async function authenticate(req: AuthRequest, _res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new AppError('Unauthorized', 401);

    // Try JWT first
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      req.user = { id: decoded.id, role: decoded.role, email: decoded.email, employeeId: decoded.employeeId };
      next();
      return;
    } catch {
      // JWT failed — try Firebase token
    }

    // Try Firebase token
    const firebaseUser = await verifyFirebaseToken(token);
    if (firebaseUser) {
      const user = await prisma.user.findUnique({ where: { email: firebaseUser.email! } });
      if (!user) throw new AppError('User not registered in system', 403);
      req.user = { id: user.id, role: user.role, email: user.email };
      next();
      return;
    }

    throw new AppError('Invalid or expired token', 401);
  } catch (err) {
    next(err);
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError('Forbidden: insufficient permissions', 403));
      return;
    }
    next();
  };
}

// Role helpers
export const onlyAdmin = authorize('ADMIN');
export const adminOrHR = authorize('ADMIN', 'HR');
export const adminHROrManager = authorize('ADMIN', 'HR', 'MANAGER');
export const allRoles = authorize('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE');
