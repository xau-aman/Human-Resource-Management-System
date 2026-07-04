import { Request, Response, NextFunction } from 'express';
import * as leaveService from '../services/leave.service';
import { createResponse } from '../types/api.types';
import { AppError } from '../utils/AppError';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export async function getLeaveRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const employeeId = req.query.employeeId as string | undefined;
    const requests = await leaveService.getLeaveRequests({ status, employeeId });
    res.json(createResponse(requests));
  } catch (err) {
    next(err);
  }
}

export async function createLeaveRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const request = await leaveService.createLeaveRequest(req.body as Parameters<typeof leaveService.createLeaveRequest>[0]);
    res.status(201).json(createResponse(request, 'Leave request submitted'));
  } catch (err) {
    next(err);
  }
}

export async function approveLeave(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Check authorization - only HR and ADMIN can approve
    if (!req.user || (req.user.role !== 'HR' && req.user.role !== 'ADMIN')) {
      throw new AppError('Only HR and ADMIN can approve leave requests', 403);
    }

    const id = req.params['id'] as string;
    const request = await leaveService.approveLeave(id, req.user.id);
    res.json(createResponse(request, 'Leave approved'));
  } catch (err) {
    next(err);
  }
}

export async function rejectLeave(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Check authorization - only HR and ADMIN can reject
    if (!req.user || (req.user.role !== 'HR' && req.user.role !== 'ADMIN')) {
      throw new AppError('Only HR and ADMIN can reject leave requests', 403);
    }

    const id = req.params['id'] as string;
    const request = await leaveService.rejectLeave(id, req.user.id);
    res.json(createResponse(request, 'Leave rejected'));
  } catch (err) {
    next(err);
  }
}

export async function getLeaveBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const employeeId = req.params['employeeId'] as string;
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
    const balance = await leaveService.getLeaveBalance(employeeId, year);
    res.json(createResponse(balance));
  } catch (err) {
    next(err);
  }
}

export async function validateLeaveRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validation = await leaveService.validateLeaveRequest(req.body as Parameters<typeof leaveService.validateLeaveRequest>[0]);
    res.json(createResponse(validation));
  } catch (err) {
    next(err);
  }
}
