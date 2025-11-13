import { AppError } from '@/shared/errors/app-error';
import { UpdateUserStatusRequest, UpdateUserStatusResponse } from '@/domain/types/admin/update-user-status.type'
import { IDoctorRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository.interface';
import { IUpdateUserStatusUseCase } from '../interfaces/admin/update-user-status.use-case.interface';
export class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase {
    constructor(
        private readonly doctorRepository: IDoctorRepository
    ) { }

    async execute(userId: string, request: UpdateUserStatusRequest): Promise<UpdateUserStatusResponse> {
        // Validate input

        this.validateRequest(request);

        // Find patient by user ID
        const doctor = await this.doctorRepository.updateByUserId(userId, request);
        if (!doctor) {
            throw new AppError('Doctor profile not found', 'DOCTOR_NOT_FOUND', 404);
        }

        // Return response
        return {
            success: true,
            message: 'isActive updated successfully',
            data: {
                userId: doctor.id,
                isActive: doctor.isActive
            },
            timestamp: new Date().toISOString()
        };
    }

    private validateRequest(request: UpdateUserStatusRequest): void {
        if (request.isActive === undefined) {
            throw new AppError('Invalid input data', 'USER_001', 400);
        }

    }
}