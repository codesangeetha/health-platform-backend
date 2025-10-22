import { Request, Response } from 'express';

export interface IUploadPrescriptionController {
    handle(req: Request, res: Response): Promise<void>;
}
