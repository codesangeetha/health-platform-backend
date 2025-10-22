import { Request, Response } from 'express';

export interface IGetLabTestController {
    handle(req: Request, res: Response): Promise<void>;
}