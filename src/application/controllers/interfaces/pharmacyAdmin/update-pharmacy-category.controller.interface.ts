import { Request, Response } from 'express';

export interface IUpdatePharmacyCategoryController {
  handle(request: Request, response: Response): Promise<void>;
}