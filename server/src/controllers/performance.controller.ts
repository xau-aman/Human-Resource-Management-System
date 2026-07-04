import { Request, Response, NextFunction } from 'express';
import * as performanceService from '../services/performance.service';
import { createResponse } from '../types/api.types';
import { AppError } from '../utils/AppError';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

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
    const employeeId = req.params['employeeId'] as string;
    const review = await performanceService.getEmployeePerformance(employeeId);
    res.json(createResponse(review));
  } catch (err) {
    next(err);
  }
}

export async function getTopPerformers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const topPerformers = await performanceService.getTopPerformers(limit);
    res.json(createResponse(topPerformers));
  } catch (err) {
    next(err);
  }
}

export async function getPerformanceTrend(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const employeeId = req.params['employeeId'] as string;
    const trend = await performanceService.getPerformanceTrend(employeeId);
    res.json(createResponse(trend));
  } catch (err) {
    next(err);
  }
}

export async function createPerformanceReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Check authorization - only HR and ADMIN can create reviews
    if (!req.user || (req.user.role !== 'HR' && req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER')) {
      throw new AppError('Only HR, ADMIN and MANAGER can create performance reviews', 403);
    }

    const review = await performanceService.createPerformanceReview({
      ...req.body,
      reviewedBy: req.user.id,
    });
    res.status(201).json(createResponse(review, 'Performance review created'));
  } catch (err) {
    next(err);
  }
}

export async function calculateScore(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { tasksCompleted, goalsAchieved, totalGoals, managerRating, attendanceRate } = req.body;

    if (typeof tasksCompleted !== 'number' || typeof managerRating !== 'number') {
      throw new AppError('Invalid input parameters', 400);
    }

    const score = performanceService.calculatePerformanceScore(
      tasksCompleted,
      goalsAchieved,
      totalGoals,
      managerRating,
      attendanceRate ?? 1.0
    );

    const rating = performanceService.getPerformanceRating(score);

    res.json(
      createResponse({
        score,
        rating,
        color: performanceService.getPerformanceColor(rating),
      })
    );
  } catch (err) {
    next(err);
  }
}
