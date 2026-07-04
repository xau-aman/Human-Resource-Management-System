import { Request, Response, NextFunction } from 'express';
import * as skillsService from '../services/skills.service';
import { createResponse } from '../types/api.types';

export async function getSkills(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const skills = await skillsService.getSkills();
    res.json(createResponse(skills));
  } catch (err) {
    next(err);
  }
}

export async function getSkillsMatrix(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // TODO[SKILLS]: Add skill gap analysis
    const matrix = await skillsService.getSkillsMatrix();
    res.json(createResponse(matrix));
  } catch (err) {
    next(err);
  }
}
