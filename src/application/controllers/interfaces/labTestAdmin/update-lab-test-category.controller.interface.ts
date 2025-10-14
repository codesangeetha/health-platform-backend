import { Request, Response } from 'express';

export interface IUpdateLabTestCategoryController {
    handle(req: Request, res: Response): Promise<void>;
}