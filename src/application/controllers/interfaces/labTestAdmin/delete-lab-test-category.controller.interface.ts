import { Request, Response } from 'express';

export interface IDeleteLabTestCategoryController {
    handle(req: Request, res: Response): Promise<void>;
}