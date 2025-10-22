import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetPatientAppointmentsUseCase } from '@/domain/use-cases/interfaces/appointments/get-patient-appointments.use-case.interface';
import { GetPatientAppointmentsRequest } from '@/domain/types/appointments/get-patient-appointments.type';
import { IGetPatientAppointmentsController } from '../interfaces/appointments/get-patient-appointments.controller.interface';

export class GetPatientAppointmentsController implements IGetPatientAppointmentsController {
    constructor(
        private readonly getPatientAppointmentsUseCase: IGetPatientAppointmentsUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {

            const patientId = (request as any).user?.userId;
            //Get page and limit from query params
            const page = request.query.page ? parseInt(request.query.page as string, 10) : 1;
            const limit = request.query.limit ? parseInt(request.query.limit as string, 10) : 10;



            const getPatientAppointmentsReq: GetPatientAppointmentsRequest = {
                page: page,
                limit: limit,
                status: request.query.status as any
            };

            const result = await this.getPatientAppointmentsUseCase.execute(getPatientAppointmentsReq, patientId);

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