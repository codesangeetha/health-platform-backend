import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IUpdateAppointmentStatusUseCase } from '@/domain/use-cases/interfaces/appointments/update-appointment-status.use-case.interface';
import { UpdateAppointmentStatusRequest } from '@/domain/types/appointments/update-appointment-status.type';
import { IUpdateAppointmentStatusController } from '../interfaces/appointments/update-appointment-status.controller.interface';

export class UpdateAppointmentStatusController implements IUpdateAppointmentStatusController {
    constructor(
        private readonly updateAppointmentStatusUseCase: IUpdateAppointmentStatusUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const appointmentId = (request as any).params.appointmentId;

            const useCaseRequest: UpdateAppointmentStatusRequest = {
                status: request.body.status,
                reason: request.body.reason
            };

            const result = await this.updateAppointmentStatusUseCase.execute(appointmentId, useCaseRequest);

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