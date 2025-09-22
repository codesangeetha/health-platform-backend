import { Request, Response } from 'express';

export interface IRescheduleAppointmentController {
  handle(request: Request, response: Response): Promise<void>;
}
