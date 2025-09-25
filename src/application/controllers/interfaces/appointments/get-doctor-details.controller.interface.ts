import { Request, Response } from 'express';

export interface IGetDoctorDetailsController {
    handle(request: Request, response: Response): Promise<void>;
}