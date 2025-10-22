import { Request, Response } from 'express';

export interface ICreatePrescriptionController {
    handle(req: Request, res: Response): Promise<void>;
}