import { Request, Response } from 'express';

export interface IEditDoctorProfileController {
    handle(request: Request, response: Response): Promise<void>;
}