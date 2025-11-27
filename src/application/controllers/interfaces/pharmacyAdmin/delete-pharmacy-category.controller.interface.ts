import { Request, Response } from 'express';

export interface IDeletePharmacyCategoryController {
  handle(request: Request, response: Response): Promise<void>;
}