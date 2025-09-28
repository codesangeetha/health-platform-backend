import { Request, Response } from 'express';

export interface IAddMedCategoryController {
   handle(req: Request, res: Response): Promise<void>;
}