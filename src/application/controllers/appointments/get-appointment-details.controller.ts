import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetAppointmentDetailsController } from '../interfaces/appointments/get-appointment-details.controller.interface';
import { IGetAppointmentDetailsUseCase } from '@/domain/use-cases/interfaces/appointments/get-appointment-details.use-case.interface';
import { GetAppointmentDetailsRequest } from '@/domain/types/appointments/get-appointment-details.type';

export class GetAppointmentDetailsController implements IGetAppointmentDetailsController {
    constructor(
        private readonly getAppointmentDetailsUseCase: IGetAppointmentDetailsUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            // Extract appointment ID from request parameters
            const appointmentId = request.params.appointmentId;

            if (!appointmentId) {
                throw new AppError('Appointment ID is required', 'INVALID_INPUT', 400);
            }

            const useCaseRequest: GetAppointmentDetailsRequest = {
                appointmentId
            };

            const result = await this.getAppointmentDetailsUseCase.execute(useCaseRequest);

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