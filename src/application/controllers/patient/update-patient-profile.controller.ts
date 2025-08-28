import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IUpdatePatientProfileUseCase } from '@/domain/use-cases/interfaces/patient/update-patient-profile.use-case.interface';
import { UpdatePatientProfileRequest } from '@/domain/types/patient/update-patient-profile.type';
import { IUpdatePatientProfileController } from '../interfaces/patient/update-patient-profile.controller.interface';

export class UpdatePatientProfileController implements IUpdatePatientProfileController {
    constructor(
        private readonly updatePatientProfileUseCase: IUpdatePatientProfileUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            // Extract user ID from authenticated request (assuming JWT middleware adds this)

            const userId = (request as any).user?.userId;


            if (!userId) {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            const useCaseRequest: UpdatePatientProfileRequest = {
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                phone: request.body.phone,
                bloodGroup: request.body.bloodGroup,
                allergies: request.body.allergies,
                chronicDiseases: request.body.chronicDiseases,
                emergencyContact: request.body.emergencyContact
            };

            const result = await this.updatePatientProfileUseCase.execute(userId, useCaseRequest);

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