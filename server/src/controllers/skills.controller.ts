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
    const matrix = await skillsService.getSkillsMatrix();
    res.json(createResponse(matrix));
  } catch (err) {
    next(err);
  }
}

export async function getSkillGaps(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const department = req.query.department as string | undefined;
    const skill = req.query.skill as string | undefined;
    const level = req.query.level as string | undefined;
    const intelligence = await skillsService.getSkillIntelligence(department, skill, level);
    res.json(createResponse(intelligence));
  } catch (err) {
    next(err);
  }
}

export async function getEmployeeSkillProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const employeeId = req.params.employeeId as string;
    const profile = skillsService.getEmployeeSkillProfile(employeeId);
    res.json(createResponse(profile));
  } catch (err) {
    next(err);
  }
}

export async function upsertEmployeeSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const employeeId = req.params.employeeId as string;
    const { skillName, level } = req.body as { skillName: string; level: string };
    const profile = await skillsService.upsertEmployeeSkill(employeeId, skillName, level);
    res.json(createResponse(profile, 'Employee skill updated'));
  } catch (err) {
    next(err);
  }
}
