import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { DeleteDoctorRequest } from '@/domain/types/doctor/delete-doctor.type';
import { IDeleteDoctorController } from '../interfaces/doctor/delete-doctor.controller.interface';
import { IDeleteDoctorUseCase } from '@/domain/use-cases/interfaces/doctor/delete-doctor.use-case.interface';

export class DeleteDoctorController implements IDeleteDoctorController {
    constructor(
        private readonly deleteDoctorUseCase: IDeleteDoctorUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const userId = (request as any).user?.userId;

            if (!userId) {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            const doctorId = request.params.id;
            if (!doctorId) {
                throw new AppError('Doctor ID is required', 'INVALID_INPUT', 400);
            }

            // Check if user is admin or has permission to delete
            const userRole = (request as any).user?.userType;
            if (userRole === 'admin') {
                // Admin can delete any doctor
                // Proceed with the delete
            } else if (userRole === 'doctor') {
                // Doctor can only delete their own profile
                if (userId !== doctorId) {
                    throw new AppError('Insufficient permissions to delete this doctor', 'FORBIDDEN', 403);
                }
            } else {
                // Other roles cannot delete doctors
                throw new AppError('Insufficient permissions to delete doctor', 'FORBIDDEN', 403);
            }

            const useCaseRequest: DeleteDoctorRequest = {
                doctorId: doctorId,
                reason: request.body.reason,
            };

            const result = await this.deleteDoctorUseCase.execute(doctorId, useCaseRequest);

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