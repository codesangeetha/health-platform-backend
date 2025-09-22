import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetDoctorAppointmentsUseCase } from '@/domain/use-cases/interfaces/appointments/get-doctor-appointments.use-case.interface';
import { GetDoctorAppointmentsRequest } from '@/domain/types/appointments/get-doctor-appointments.type';
import { IGetDoctorAppointmentsController } from '../interfaces/appointments/get-doctor-appointments.controller.interface';

export class GetDoctorAppointmentsController implements IGetDoctorAppointmentsController {
    constructor(
        private readonly getDoctorAppointmentsUseCase: IGetDoctorAppointmentsUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const doctorId = (request as any).user?.userId;
            
            // Get query parameters
            const getDoctorAppointmentsReq: GetDoctorAppointmentsRequest = {
                date: request.query.date as string,
                status: request.query.status as any,
                page: request.query.page ? parseInt(request.query.page as string, 10) : 1,
                limit: request.query.limit ? parseInt(request.query.limit as string, 10) : 10
            };

            const result = await this.getDoctorAppointmentsUseCase.execute(getDoctorAppointmentsReq, doctorId);

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