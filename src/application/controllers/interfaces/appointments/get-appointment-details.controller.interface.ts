import { Request, Response } from 'express';

export interface IGetAppointmentDetailsController {
    handle(request: Request, response: Response): Promise<void>;
}