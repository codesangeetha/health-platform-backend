import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IRescheduleAppointmentUseCase } from '@/domain/use-cases/interfaces/appointments/reschedule-appointment.use-case.interface';
import { RescheduleAppointmentRequest } from '@/domain/types/appointments/reschedule-appointment.type';
import { IRescheduleAppointmentController } from '../interfaces/appointments/reschedule-appointment.controller.interface';

export class RescheduleAppointmentController implements IRescheduleAppointmentController {
    constructor(
        private readonly rescheduleAppointmentUseCase: IRescheduleAppointmentUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {

            const appointmentId = (request as any).params.appointmentId;

            const useCaseRequest: RescheduleAppointmentRequest = {
                newDate: request.body.newDate,
                newTime: request.body.newTime,
                reason: request.body.reason
            };

            const result = await this.rescheduleAppointmentUseCase.execute(appointmentId, useCaseRequest);

            response.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                response.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.errorCode,
                    timestamp: new Date().toISOString()
                });
            } else {
                response.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: 'INTERNAL_SERVER_ERROR',
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
}