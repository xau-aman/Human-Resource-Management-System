import { Router, Request, Response } from 'express';
import { createResponse } from '../types/api.types';

const router = Router();

// TODO[CORE]: Replace mock auth with real JWT implementation
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password required', data: null, timestamp: new Date().toISOString() });
    return;
  }
  // Mock: accept any credentials for hackathon dev
  res.json(createResponse({
    token: 'mock-jwt-token',
    user: { id: 'mock-id', email, role: 'ADMIN' },
  }, 'Login successful'));
});

router.post('/logout', (_req: Request, res: Response) => {
  res.json(createResponse(null, 'Logged out'));
});

export default router;
