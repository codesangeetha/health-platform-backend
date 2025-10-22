import { Request, Response } from 'express';

export interface IGetPatientOrdersController {
    handle(req: Request, res: Response): Promise<void>;
}