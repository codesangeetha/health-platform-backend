import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetDoctorCalendarUseCase } from '@/domain/use-cases/interfaces/appointments/get-doctor-calendar.use-case.interface';
import { GetDoctorCalendarRequest } from '@/domain/types/appointments/get-doctor-calendar.type';
import { IGetDoctorCalendarController } from '../interfaces/appointments/get-doctor-calendar.controller.interface';

export class GetDoctorCalendarController implements IGetDoctorCalendarController {
    constructor(
        private readonly getDoctorCalendarUseCase: IGetDoctorCalendarUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const doctorId = (request as any).user?.userId;
            
            if (!doctorId) {
                throw new AppError('Doctor ID not found in token', 'UNAUTHORIZED', 401);
            }

            // Get query parameters
            const year = parseInt(request.query.year as string, 10);
            const month = parseInt(request.query.month as string, 10);

            if (!year || !month) {
                throw new AppError('Year and month are required query parameters', 'BAD_REQUEST', 400);
            }

            const getDoctorCalendarReq: GetDoctorCalendarRequest = {
                year,
                month
            };

            const result = await this.getDoctorCalendarUseCase.execute(getDoctorCalendarReq, doctorId);

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