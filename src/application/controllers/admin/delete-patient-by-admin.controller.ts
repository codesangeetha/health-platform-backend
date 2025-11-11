import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { DeletePatientByAdminRequest } from '@/domain/types/admin/delete-patient-by-admin.type';
import { IDeletePatientByAdminController } from '../interfaces/admin/delete-patient-by-admin.controller.interface';
import { IDeletePatientByAdminUseCase } from '@/domain/use-cases/interfaces/admin/delete-patient-by-admin.use-case.interface';

export class DeletePatientByAdminController implements IDeletePatientByAdminController {
    constructor(
        private readonly deletePatientByAdminUseCase: IDeletePatientByAdminUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            // Check if user is authenticated
            const userId = (request as any).user?.userId;
            const userRole = (request as any).user?.userType;

            if (!userId) {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            // Only admin can delete patient profiles
            if (userRole !== 'admin') {
                throw new AppError('Only admin can delete patient profiles', 'FORBIDDEN', 403);
            }

            // Get patientId from URL parameters
            const patientId = request.params.id;
            if (!patientId) {
                throw new AppError('Patient ID is required', 'INVALID_INPUT', 400);
            }

            const useCaseRequest: DeletePatientByAdminRequest = {
                reason: request.body?.reason
            };

            const result = await this.deletePatientByAdminUseCase.execute(patientId, useCaseRequest);

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