import { Request, Response } from 'express';

export interface ICreateLabTestCategoryController {
    handle(req: Request, res: Response): Promise<void>;
}