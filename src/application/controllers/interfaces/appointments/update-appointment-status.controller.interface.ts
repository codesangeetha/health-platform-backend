import { Request, Response } from 'express';

export interface IUpdateAppointmentStatusController {
  handle(request: Request, response: Response): Promise<void>;
}