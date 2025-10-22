import { Request, Response } from 'express';
import { IBookAppointmentController } from '../interfaces/appointments/book-appointment.controller.interface';
import { AppError } from '@/shared/errors/app-error';
import { IBookAppointmentUseCase } from '@/domain/use-cases/interfaces/appointments/book-appointment.use-case.interface';
import { BookAppointmentRequest } from '@/domain/types/appointments/book-appointment.type';

export class BookAppointmentController implements IBookAppointmentController {
    constructor(
        private readonly bookAppointmentUseCase: IBookAppointmentUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {

            console.log("req as user :", (req as any).user);
            let patientId;//= (req as any).user?.userId?.id;

            if ((req as any).user?.userId) {
                patientId = (req as any).user?.userId;
            } else {
                patientId = (req as any).user?.id;
            }
            const appointmentRequest: BookAppointmentRequest = {
                ...req.body
            };

            const result = await this.bookAppointmentUseCase.execute(appointmentRequest, patientId);

            res.status(201).json(result);

        } catch (error) {

            if (error instanceof AppError) {
                console.log('AppError caught:', {
                    message: error.message,
                    errorCode: error.errorCode,
                    statusCode: error.statusCode
                });

                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.errorCode
                });
            } else {
                console.log('Non-AppError caught, sending generic 500 response');

                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: 'INTERNAL_SERVER_ERROR'
                });
            }

            console.log('=== REGISTER USER ERROR END ===');
        }
    }
}