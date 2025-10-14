import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetAvailableDoctorsController } from '../interfaces/appointments/get-available-doctors.controller.interface';
import { IGetAvailableDoctorsUseCase } from '@/domain/use-cases/interfaces/appointments/get-available-doctors.use-case.interface';
import { GetAvailableDoctorsRequest } from '@/domain/types/appointments/get-available-doctors.type';

export class GetAvailableDoctorsController implements IGetAvailableDoctorsController {
    constructor(
        private readonly getAvailableDoctorsUseCase: IGetAvailableDoctorsUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const page = request.query.page ? parseInt(request.query.page as string, 10) : 1;
            const limit = request.query.limit ? parseInt(request.query.limit as string, 10) : 10;
            const specialization = request.query.specialization as string;
            const availableDays = request.query.availableDays as any;
            const searchName = request.query.searchName as string;

            const useCaseRequest: GetAvailableDoctorsRequest = {
                //userType,
                page,
                limit,
                specialization,
                availableDays,
                searchName
            };

            const result = await this.getAvailableDoctorsUseCase.execute(useCaseRequest);

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