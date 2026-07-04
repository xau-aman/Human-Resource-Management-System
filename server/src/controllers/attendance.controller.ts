import { Request, Response, NextFunction } from 'express';
import * as attendanceService from '../services/attendance.service';
import { createResponse } from '../types/api.types';

export async function getAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const date = req.query.date as string | undefined;
    const employeeId = req.query.employeeId as string | undefined;
    const records = await attendanceService.getAttendance({ date, employeeId });
    res.json(createResponse(records));
  } catch (err) {
    next(err);
  }
}

export async function getAttendanceSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const date = req.query.date as string | undefined;
    const summary = await attendanceService.getAttendanceSummary(date);
    res.json(createResponse(summary));
  } catch (err) {
    next(err);
  }
}

export async function createAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // TODO[ATTENDANCE]: Implement attendance creation with validation
    const record = await attendanceService.createAttendance(req.body as Parameters<typeof attendanceService.createAttendance>[0]);
    res.status(201).json(createResponse(record, 'Attendance recorded'));
  } catch (err) {
    next(err);
  }
}
