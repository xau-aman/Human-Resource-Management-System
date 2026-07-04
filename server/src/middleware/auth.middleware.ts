import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

// TODO[CORE]: Replace with real JWT verification
export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    next(new AppError('Unauthorized', 401));
    return;
  }
  // Mock: accept any token for hackathon dev
  req.user = { id: 'mock-user-id', role: 'ADMIN', email: 'admin@workzen.com' };
  next();
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError('Forbidden', 403));
      return;
    }
    next();
  };
}
