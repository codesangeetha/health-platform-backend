import { Request, Response } from 'express';

export interface IGetPatientAppointmentsController {
  handle(request: Request, response: Response): Promise<void>;
}