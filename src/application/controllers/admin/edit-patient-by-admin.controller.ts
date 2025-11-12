import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { EditPatientByAdminRequest } from '@/domain/types/admin/edit-patient-by-admin.type';
import { IEditPatientByAdminController } from '../interfaces/admin/edit-patient-by-admin.controller.interface';
import { IEditPatientByAdminUseCase } from '@/domain/use-cases/interfaces/admin/edit-patient-by-admin.use-case.interface';

export class EditPatientByAdminController implements IEditPatientByAdminController {
    constructor(
        private readonly editPatientByAdminUseCase: IEditPatientByAdminUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            // Check if user is authenticated
            const userId = (request as any).user?.userId;
            const userRole = (request as any).user?.userType;

            if (!userId) {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            // Only admin can edit patient profiles
            if (userRole !== 'admin') {
                throw new AppError('Only admin can edit patient profiles', 'FORBIDDEN', 403);
            }

            // Get patientId from URL parameters
            const patientId = request.params.id;
            if (!patientId) {
                throw new AppError('Patient ID is required', 'INVALID_INPUT', 400);
            }

            const useCaseRequest: EditPatientByAdminRequest = {
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                email: request.body.email,
                phone: request.body.phone,
                whatsapp: request.body.whatsapp,
                bloodGroup: request.body.bloodGroup,
                allergies: request.body.allergies,
                chronicDiseases: request.body.chronicDiseases,
                emergencyContact: request.body.emergencyContact,
            };

            // Remove undefined fields
            Object.keys(useCaseRequest).forEach(key => {
                if (useCaseRequest[key as keyof EditPatientByAdminRequest] === undefined) {
                    delete useCaseRequest[key as keyof EditPatientByAdminRequest];
                }
            });

            const result = await this.editPatientByAdminUseCase.execute(patientId, useCaseRequest);

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