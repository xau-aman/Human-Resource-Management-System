import { Request, Response, NextFunction } from 'express';
import * as leaveService from '../services/leave.service';
import { createResponse } from '../types/api.types';
import { AppError } from '../utils/AppError';

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

export async function getLeaveBalance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const employeeId = req.query.employeeId as string | undefined;
    const leaveType = req.query.leaveType as string | undefined;

    if (!employeeId || !leaveType) {
      throw new AppError('employeeId and leaveType are required', 400);
    }

    const balance = await leaveService.getLeaveBalance(employeeId, leaveType);
    res.json(createResponse(balance, 'Leave balance fetched'));
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
    const actorRole = req.headers['x-user-role'] as string | undefined;
    const request = await leaveService.approveLeave(req.params['id'] as string, actorRole);
    res.json(createResponse(request, 'Leave approved'));
  } catch (err) {
    next(err);
  }
}

export async function rejectLeave(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const actorRole = req.headers['x-user-role'] as string | undefined;
    const request = await leaveService.rejectLeave(req.params['id'] as string, actorRole);
    res.json(createResponse(request, 'Leave rejected'));
  } catch (err) {
    next(err);
  }
}
