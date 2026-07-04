import { Response, NextFunction } from 'express';
import * as leaveService from '../services/leave.service';
import { createResponse } from '../types/api.types';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../utils/AppError';

export async function getLeaveRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const employeeId = req.query.employeeId as string | undefined;
    const requests = await leaveService.getLeaveRequests({ status, employeeId });
    res.json(createResponse(requests));
  } catch (err) {
    next(err);
  }
}

export async function getMyLeaves(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await (await import('../config/prisma')).default.user.findUnique({ where: { id: req.user!.id }, include: { employee: true } });
    if (!user?.employee) { res.json(createResponse([])); return; }
    const requests = await leaveService.getLeaveRequests({ employeeId: user.employee.id });
    res.json(createResponse(requests));
  } catch (err) {
    next(err);
  }
}

export async function getLeaveBalance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const employeeId = req.query.employeeId as string | undefined;
    const leaveType = req.query.leaveType as string | undefined;
    if (!employeeId || !leaveType) throw new AppError('employeeId and leaveType are required', 400);
    const balance = await leaveService.getLeaveBalance(employeeId, leaveType);
    res.json(createResponse(balance, 'Leave balance fetched'));
  } catch (err) {
    next(err);
  }
}

export async function createLeaveRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    // Get employee ID from auth user
    const user = await (await import('../config/prisma')).default.user.findUnique({ where: { id: req.user!.id }, include: { employee: true } });
    if (!user?.employee) throw new AppError('Employee profile not found', 404);
    const request = await leaveService.createLeaveRequest({ ...req.body, employeeId: user.employee.id });
    res.status(201).json(createResponse(request, 'Leave request submitted'));
  } catch (err) {
    next(err);
  }
}

export async function approveLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const request = await leaveService.approveLeave(req.params['id'] as string, req.user!.role);
    res.json(createResponse(request, 'Leave approved'));
  } catch (err) {
    next(err);
  }
}

export async function rejectLeave(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const request = await leaveService.rejectLeave(req.params['id'] as string, req.user!.role);
    res.json(createResponse(request, 'Leave rejected'));
  } catch (err) {
    next(err);
  }
}
