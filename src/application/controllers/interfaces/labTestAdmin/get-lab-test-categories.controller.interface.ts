import { Request, Response } from 'express';

export interface IGetLabTestCategoriesController {
    handle(req: Request, res: Response): Promise<void>;
}