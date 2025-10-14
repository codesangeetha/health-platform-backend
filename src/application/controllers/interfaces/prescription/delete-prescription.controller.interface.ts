import { Request, Response } from 'express';

export interface IDeletePrescriptionController {
    handle(req: Request, res: Response): Promise<void>;
}