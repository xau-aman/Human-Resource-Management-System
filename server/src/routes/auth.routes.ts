import { Router, Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { createResponse } from '../types/api.types';

const router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) throw new Error('Email and password required');
    const result = await authService.loginWithEmail(email, password);
    res.json(createResponse(result, 'Login successful'));
  } catch (err) { next(err); }
});

router.post('/firebase', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firebaseUid, email } = req.body as { firebaseUid: string; email: string };
    const result = await authService.loginWithFirebase(firebaseUid, email);
    res.json(createResponse(result, 'Firebase login successful'));
  } catch (err) { next(err); }
});

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body as { email: string; password: string; role?: string };
    const result = await authService.registerUser(email, password, role);
    res.status(201).json(createResponse(result, 'Registration successful'));
  } catch (err) { next(err); }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.id);
    res.json(createResponse(user));
  } catch (err) { next(err); }
});

router.post('/logout', (_req: Request, res: Response) => {
  res.json(createResponse(null, 'Logged out'));
});

export default router;
