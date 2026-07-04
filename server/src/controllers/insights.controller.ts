import { Request, Response, NextFunction } from 'express';
import * as insightsService from '../services/insights.service';
import { createResponse } from '../types/api.types';

export async function getInsights(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const insights = await insightsService.getInsights();
    res.json(createResponse(insights));
  } catch (err) {
    next(err);
  }
}

export async function askWorkforceQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // TODO[AI-INSIGHTS]: Connect workforce intelligence engine
    const { question } = req.body as { question: string };
    const answer = await insightsService.askWorkforceQuestion(question);
    res.json(createResponse(answer));
  } catch (err) {
    next(err);
  }
}
