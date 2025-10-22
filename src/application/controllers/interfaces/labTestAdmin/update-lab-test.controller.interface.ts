import { Request, Response } from 'express';

export interface IUpdateLabTestController {
    handle(req: Request, res: Response): Promise<void>;
}