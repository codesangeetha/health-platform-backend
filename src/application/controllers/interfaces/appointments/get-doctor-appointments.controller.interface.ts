import { Request, Response } from 'express';

export interface IGetDoctorAppointmentsController {
  handle(request: Request, response: Response): Promise<void>;
}