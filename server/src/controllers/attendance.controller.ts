import { Response, NextFunction } from 'express';
import * as attendanceService from '../services/attendance.service';
import { createResponse } from '../types/api.types';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const date = req.query.date as string | undefined;
    const employeeId = req.query.employeeId as string | undefined;
    const records = await attendanceService.getAttendance({ date, employeeId });
    res.json(createResponse(records));
  } catch (err) {
    next(err);
  }
}

export async function getMyAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await (await import('../config/prisma')).default.user.findUnique({ where: { id: req.user!.id }, include: { employee: true } });
    if (!user?.employee) { res.json(createResponse([])); return; }
    const records = await attendanceService.getMyAttendance(user.employee.id);
    res.json(createResponse(records));
  } catch (err) {
    next(err);
  }
}

export async function getAttendanceSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const date = req.query.date as string | undefined;
    const summary = await attendanceService.getAttendanceSummary(date);
    res.json(createResponse(summary));
  } catch (err) {
    next(err);
  }
}

export async function clockIn(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const record = await attendanceService.clockIn(req.user!.id);
    res.status(201).json(createResponse(record, 'Clocked in successfully'));
  } catch (err) {
    next(err);
  }
}

export async function clockOut(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const record = await attendanceService.clockOut(req.user!.id);
    res.json(createResponse(record, 'Clocked out successfully'));
  } catch (err) {
    next(err);
  }
}

export async function createAttendance(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const record = await attendanceService.createAttendance(req.body);
    res.status(201).json(createResponse(record, 'Attendance recorded'));
  } catch (err) {
    next(err);
  }
}
