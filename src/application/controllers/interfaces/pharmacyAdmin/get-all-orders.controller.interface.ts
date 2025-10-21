import { Request, Response } from 'express';

export interface IGetAllOrdersController {
    handle(req: Request, res: Response): Promise<void>;
}