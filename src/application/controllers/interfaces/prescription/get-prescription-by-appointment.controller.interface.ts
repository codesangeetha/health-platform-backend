import { Request, Response } from 'express';

export interface IGetPrescriptionByAppointmentController {
    handle(req: Request, res: Response): Promise<void>;
}