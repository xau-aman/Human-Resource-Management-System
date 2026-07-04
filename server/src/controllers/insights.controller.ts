import { Request, Response, NextFunction } from 'express';
import * as insightsService from '../services/insights.service';
import { createResponse } from '../types/api.types';

export async function getInsights(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const insights = await insightsService.getInsights();
    res.json(createResponse(insights));
  } catch (err) { next(err); }
}

export async function askWorkforceQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { question } = req.body as { question: string };
    if (!question?.trim()) { res.status(400).json({ success: false, message: 'Question required', data: null, timestamp: new Date().toISOString() }); return; }
    const answer = await insightsService.askWorkforceQuestion(question);
    res.json(createResponse(answer));
  } catch (err) { next(err); }
}

export async function resolveInsight(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const insight = await insightsService.resolveInsight(id);
    res.json(createResponse(insight, 'Insight resolved'));
  } catch (err) { next(err); }
}

export async function generateInsights(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await insightsService.generateAutoInsights();
    res.json(createResponse(null, 'Insights generated'));
  } catch (err) { next(err); }
}
