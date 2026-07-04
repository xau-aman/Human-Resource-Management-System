import { Request, Response, NextFunction } from 'express';
import * as performanceService from '../services/performance.service';
import { createResponse } from '../types/api.types';

export async function getPerformanceReviews(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const reviews = await performanceService.getPerformanceReviews();
    res.json(createResponse(reviews));
  } catch (err) {
    next(err);
  }
}

export async function getEmployeePerformance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // TODO[PERFORMANCE]: Implement performance scoring
    const employeeId = req.params['employeeId'] as string;
    const review = await performanceService.getEmployeePerformance(employeeId);
    res.json(createResponse(review));
  } catch (err) {
    next(err);
  }
}
