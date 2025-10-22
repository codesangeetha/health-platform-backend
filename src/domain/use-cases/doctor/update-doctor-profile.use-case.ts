import { AppError } from '@/shared/errors/app-error';
import { UpdateDoctorProfileRequest, UpdateDoctorProfileResponse } from '@/domain/types/doctor/update-doctor-profile.type';
import { IDoctorRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository.interface';
import { IUpdateDoctorProfileUseCase } from '../interfaces/doctor/update-doctor-profile.use-case.interface';

export class UpdateDoctorProfileUseCase implements IUpdateDoctorProfileUseCase {
    constructor(
        private readonly doctorRepository: IDoctorRepository
    ) { }

    async execute(userId: string, request: UpdateDoctorProfileRequest): Promise<UpdateDoctorProfileResponse> {
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
            message: 'Profile updated successfully',
            data: {
                doctorId: doctor.id,
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                email: doctor.email,
                phone: doctor.phone,
            },
            timestamp: new Date().toISOString()
        };
    }

    private validateRequest(request: UpdateDoctorProfileRequest): void {
        if (!request.firstName || !request.lastName || !request.phone || !request.specialization || !request.licenseNumber || !request.experience || !request.consultationFee || !request.qualification || !request.hospital || !request.availableDays || !request.availableTime) {
            throw new AppError('Invalid input data', 'USER_001', 400);
        }

    }
}