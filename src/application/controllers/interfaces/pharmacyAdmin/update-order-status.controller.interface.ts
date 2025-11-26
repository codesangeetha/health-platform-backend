import { Request, Response } from 'express';

export interface IUpdateOrderStatusController {
    handle(req: Request, res: Response): Promise<void>;
}