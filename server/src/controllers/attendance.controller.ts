import { Request, Response, NextFunction } from 'express';
import * as attendanceService from '../services/attendance.service';
import { createResponse } from '../types/api.types';

function getQueryValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    return value[0];
  }
  return undefined;
}

export async function getAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const date = getQueryValue(req.query.date);
    const employeeId = getQueryValue(req.query.employeeId);
    const records = await attendanceService.getAttendance({ date, employeeId });
    res.json(createResponse(records));
  } catch (err) {
    next(err);
  }
}

export async function getAttendanceSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const date = getQueryValue(req.query.date);
    const summary = await attendanceService.getAttendanceSummary(date);
    res.json(createResponse(summary));
  } catch (err) {
    next(err);
  }
}

export async function getEmployeeAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const employeeId = getQueryValue(req.params.employeeId);
    const records = await attendanceService.getAttendance({ employeeId });
    res.json(createResponse(records));
  } catch (err) {
    next(err);
  }
}

export async function getEmployeeAttendancePercentage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const employeeId = getQueryValue(req.params.employeeId);
    if (!employeeId) {
      res.status(400).json(createResponse(null, 'Employee ID is required'));
      return;
    }

    const percentage = await attendanceService.getEmployeeAttendancePercentage(employeeId);
    res.json(createResponse({ employeeId, percentage }));
  } catch (err) {
    next(err);
  }
}

export async function createAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const record = await attendanceService.createAttendance(req.body as Parameters<typeof attendanceService.createAttendance>[0]);
    res.status(201).json(createResponse(record, 'Attendance recorded'));
  } catch (err) {
    next(err);
  }
}

export async function checkInAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { employeeId, date, checkIn } = req.body;
    const record = await attendanceService.createAttendance({
      employeeId,
      date: date ?? new Date().toISOString(),
      checkIn: checkIn ?? new Date().toISOString(),
    });
    res.status(201).json(createResponse(record, 'Check-in recorded'));
  } catch (err) {
    next(err);
  }
}

export async function checkOutAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { employeeId, date, checkOut } = req.body;
    const record = await attendanceService.createAttendance({
      employeeId,
      date: date ?? new Date().toISOString(),
      checkOut: checkOut ?? new Date().toISOString(),
    });
    res.status(201).json(createResponse(record, 'Check-out recorded'));
  } catch (err) {
    next(err);
  }
}
