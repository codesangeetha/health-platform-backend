import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { EditDoctorProfileRequest } from '@/domain/types/doctor/edit-doctor-profile.type';
import { IEditDoctorProfileController } from '../interfaces/doctor/edit-doctor-profile.controller.interface';
import { IEditDoctorProfileUseCase } from '@/domain/use-cases/interfaces/doctor/edit-doctor-profile.use-case.interface';

export class EditDoctorProfileController implements IEditDoctorProfileController {
    constructor(
        private readonly editDoctorProfileUseCase: IEditDoctorProfileUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            // Check if user is authenticated
            const userId = (request as any).user?.userId;
            const userRole = (request as any).user?.userType;

            if (!userId) {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            // Get doctorId from URL parameters
            const doctorId = request.params.id;
            if (!doctorId) {
                throw new AppError('Doctor ID is required', 'INVALID_INPUT', 400);
            }

            // Check if user has permission to edit doctor profile
            if (userRole === 'admin') {
                // Admin can edit any doctor profile
                // Proceed with the edit
            } else if (userRole === 'doctor') {
                // Doctor can only edit their own profile
                if (userId !== doctorId) {
                    throw new AppError('Insufficient permissions to edit this doctor profile', 'FORBIDDEN', 403);
                }
            } else {
                // Other roles cannot edit doctor profiles
                throw new AppError('Insufficient permissions to edit doctor profile', 'FORBIDDEN', 403);
            }

            const useCaseRequest: EditDoctorProfileRequest = {
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                phone: request.body.phone,
                whatsapp: request.body.whatsapp,
                specialization: request.body.specialization,
                licenseNumber: request.body.licenseNumber,
                experience: request.body.experience,
                consultationFee: request.body.consultationFee,
                qualification: request.body.qualification,
                hospital: request.body.hospital,
                availableDays: request.body.availableDays,
                availableTime: request.body.availableTime,
                rating: request.body.rating,
                isActive: request.body.isActive,
            };

            // Remove undefined fields
            Object.keys(useCaseRequest).forEach(key => {
                if (useCaseRequest[key as keyof EditDoctorProfileRequest] === undefined) {
                    delete useCaseRequest[key as keyof EditDoctorProfileRequest];
                }
            });

            const result = await this.editDoctorProfileUseCase.execute(doctorId, useCaseRequest);

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