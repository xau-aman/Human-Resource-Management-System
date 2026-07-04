import { Request, Response, NextFunction } from 'express';
import * as leaveService from '../services/leave.service';
import { createResponse } from '../types/api.types';

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
    // TODO[LEAVE]: Add leave balance validation before creating
    const request = await leaveService.createLeaveRequest(req.body as Parameters<typeof leaveService.createLeaveRequest>[0]);
    res.status(201).json(createResponse(request, 'Leave request submitted'));
  } catch (err) {
    next(err);
  }
}

export async function approveLeave(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const request = await leaveService.approveLeave(id);
    res.json(createResponse(request, 'Leave approved'));
  } catch (err) {
    next(err);
  }
}

export async function rejectLeave(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const request = await leaveService.rejectLeave(id);
    res.json(createResponse(request, 'Leave rejected'));
  } catch (err) {
    next(err);
  }
}
