import { Request, Response } from 'express';

export interface IOrderLabTestController {
    handle(req: Request, res: Response): Promise<void>;
}