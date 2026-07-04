import { Request, Response, NextFunction } from 'express';
import * as performanceService from '../services/performance.service';
import { createResponse } from '../types/api.types';

export async function getPerformanceReviews(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const reviews = await performanceService.getPerformanceReviews();
    res.json(createResponse(reviews));
  } catch (err) { next(err); }
}

export async function getEmployeePerformance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const employeeId = req.params['employeeId'] as string;
    const reviews = await performanceService.getEmployeePerformance(employeeId);
    res.json(createResponse(reviews));
  } catch (err) { next(err); }
}

export async function getTopPerformers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const performers = await performanceService.getTopPerformers(limit);
    res.json(createResponse(performers));
  } catch (err) { next(err); }
}

export async function getPerformanceTrend(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const trend = await performanceService.getPerformanceTrend();
    res.json(createResponse(trend));
  } catch (err) { next(err); }
}

export async function getPerformanceSummary(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const summary = await performanceService.getPerformanceSummary();
    res.json(createResponse(summary));
  } catch (err) { next(err); }
}
