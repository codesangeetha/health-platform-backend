import { Request, Response } from 'express';

export interface IGetPrescriptionController {
    handle(req: Request, res: Response): Promise<void>;
}