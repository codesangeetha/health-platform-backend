import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetDoctorDetailsController } from '../interfaces/appointments/get-doctor-details.controller.interface';
import { IGetDoctorDetailsUseCase } from '@/domain/use-cases/interfaces/appointments/get-doctor-details.use-case.interface';
import { GetDoctorDetailsRequest } from '@/domain/types/appointments/get-doctor-details.type';

export class GetDoctorDetailsController implements IGetDoctorDetailsController {
    constructor(
        private readonly getDoctorDetailsUseCase: IGetDoctorDetailsUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            // Extract doctor ID from request parameters
            const doctorId = request.params.doctorId;

            if (!doctorId) {
                throw new AppError('Doctor ID is required', 'INVALID_INPUT', 400);
            }

            const useCaseRequest: GetDoctorDetailsRequest = {
                doctorId
            };

            const result = await this.getDoctorDetailsUseCase.execute(useCaseRequest);

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