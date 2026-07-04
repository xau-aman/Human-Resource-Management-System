import { Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analytics.service';
import { createResponse } from '../types/api.types';

export async function getWorkforceOverview(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // TODO[ANALYTICS]: Implement workforce analytics calculations
    const overview = await analyticsService.getWorkforceOverview();
    res.json(createResponse(overview));
  } catch (err) {
    next(err);
  }
}

export async function getAttendanceTrend(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const trend = await analyticsService.calculateAttendanceTrend(days);
    res.json(createResponse(trend));
  } catch (err) {
    next(err);
  }
}

export async function getDepartmentPerformance(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await analyticsService.calculateDepartmentPerformance();
    res.json(createResponse(data));
  } catch (err) {
    next(err);
  }
}
