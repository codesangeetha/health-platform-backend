import { Request, Response } from 'express';

export interface IGetLabTestCategoryController {
    handle(req: Request, res: Response): Promise<void>;
}