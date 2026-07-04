import { Request, Response, NextFunction } from 'express';
import * as skillsService from '../services/skills.service';
import { createResponse } from '../types/api.types';

function parseRequiredSkills(value: unknown) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

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

export async function getSkillIntelligence(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const department = req.query.department as string | undefined;
    const requiredSkills = parseRequiredSkills(req.query.requiredSkills);
    const intelligence = await skillsService.getSkillIntelligence(department, requiredSkills);
    res.json(createResponse(intelligence));
  } catch (err) {
    next(err);
  }
}

export async function getEmployeeSkillProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await skillsService.getEmployeeSkillProfile(req.params['employeeId'] as string);
    res.json(createResponse(profile));
  } catch (err) {
    next(err);
  }
}

export async function addEmployeeSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const createdSkill = await skillsService.addEmployeeSkill(req.params['employeeId'] as string, req.body);
    res.status(201).json(createResponse(createdSkill, 'Employee skill added'));
  } catch (err) {
    next(err);
  }
}
