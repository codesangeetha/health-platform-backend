
import { Request, Response } from 'express';

export interface IGetMedCategoryController {
   handle(req: Request, res: Response): Promise<void>;
}

