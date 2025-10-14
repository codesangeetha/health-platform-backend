import { Request, Response } from 'express';

export interface IGetLabTestsController {
    handle(req: Request, res: Response): Promise<void>;
}