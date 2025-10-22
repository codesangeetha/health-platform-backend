import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { UpdateDoctorProfileRequest } from '@/domain/types/doctor/update-doctor-profile.type';
import { IUpdateDoctorProfileController } from '../interfaces/doctor/update-doctor-profile.controller.interface';
import { IUpdateDoctorProfileUseCase } from '@/domain/use-cases/interfaces/doctor/update-doctor-profile.use-case.interface';

export class UpdateDoctorProfileController implements IUpdateDoctorProfileController {
    constructor(
        private readonly updateDoctorProfileUseCase: IUpdateDoctorProfileUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {

            const userId = (request as any).user?.userId;


            if (!userId) {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            const useCaseRequest: UpdateDoctorProfileRequest = {
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                phone: request.body.phone,
                specialization: request.body.specialization,
                licenseNumber: request.body.licenseNumber,
                experience: request.body.experience,
                consultationFee: request.body.consultationFee,
                qualification: request.body.qualification,
                hospital: request.body.hospital,
                availableDays: request.body.availableDays,
                availableTime: request.body.availableTime,
                rating: request.body.rating,
            };

            const result = await this.updateDoctorProfileUseCase.execute(userId, useCaseRequest);

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