import { Request, Response } from 'express';

export interface IGetLabTestOrderByIdController {
    handle(req: Request, res: Response): Promise<void>;
}