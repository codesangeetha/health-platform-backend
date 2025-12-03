import { Request, Response } from 'express';

export interface IGetPrescriptionDetailsController {
    handle(req: Request, res: Response): Promise<void>;
}