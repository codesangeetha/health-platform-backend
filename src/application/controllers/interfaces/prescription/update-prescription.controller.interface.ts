import { Request, Response } from 'express';

export interface IUpdatePrescriptionController {
    handle(req: Request, res: Response): Promise<void>;
}