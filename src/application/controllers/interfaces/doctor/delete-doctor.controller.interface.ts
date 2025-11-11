import { Request, Response } from 'express';

export interface IDeleteDoctorController {
    handle(request: Request, response: Response): Promise<void>;
}