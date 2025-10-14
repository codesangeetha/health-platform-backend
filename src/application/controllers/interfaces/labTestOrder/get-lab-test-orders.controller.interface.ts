import { Request, Response } from 'express';

export interface IGetLabTestOrdersController {
    handle(req: Request, res: Response): Promise<void>;
}