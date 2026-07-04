import { Request, Response, NextFunction } from 'express';
import * as employeeService from '../services/employee.service';
import { createResponse, createPaginatedResponse } from '../types/api.types';

export async function getEmployees(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const department = req.query.department as string | undefined;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const { employees, total } = await employeeService.getEmployees({ page, limit, department, status, search });
    res.json(createPaginatedResponse(employees, total, page, limit));
  } catch (err) {
    next(err);
  }
}

export async function getEmployeeById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const employee = await employeeService.getEmployeeById(id);
    res.json(createResponse(employee));
  } catch (err) {
    next(err);
  }
}

export async function createEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const employee = await employeeService.createEmployee(req.body as Parameters<typeof employeeService.createEmployee>[0]);
    res.status(201).json(createResponse(employee, 'Employee created'));
  } catch (err) {
    next(err);
  }
}

export async function updateEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const employee = await employeeService.updateEmployee(id, req.body as Parameters<typeof employeeService.updateEmployee>[1]);
    res.json(createResponse(employee, 'Employee updated'));
  } catch (err) {
    next(err);
  }
}

export async function deleteEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params['id'] as string;
    await employeeService.deleteEmployee(id);
    res.json(createResponse(null, 'Employee deleted'));
  } catch (err) {
    next(err);
  }
}
