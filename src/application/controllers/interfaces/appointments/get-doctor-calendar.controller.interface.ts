import { Request, Response } from 'express';

export interface IGetDoctorCalendarController {
    handle(request: Request, response: Response): Promise<void>;
}