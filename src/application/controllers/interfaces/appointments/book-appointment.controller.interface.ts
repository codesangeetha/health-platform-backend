import { Request, Response } from 'express';
import { BookAppointmentRequest, BookAppointmentResponse } from '@/domain/types/appointments/book-appointment.type';

export interface IBookAppointmentController {
  handle(req: Request, res: Response): Promise<void>;
}

