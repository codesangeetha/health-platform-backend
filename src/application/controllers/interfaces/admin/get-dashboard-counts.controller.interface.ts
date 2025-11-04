import { Request, Response } from 'express';

export interface IGetDashboardCountsController {
  handle(request: Request, response: Response): Promise<void>;
}