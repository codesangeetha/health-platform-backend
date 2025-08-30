
import { AppError } from '@/shared/errors/app-error';
import { IGetDoctorProfileUseCase } from '../interfaces/doctor/get-doctor-profile.use-case.interface';
import { IDoctorRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository.interface';
import { GetDoctorProfileRequest, GetDoctorProfileResponse } from '@/domain/types/doctor/get-doctor-profile.type';

export class GetDoctorProfileUseCase implements IGetDoctorProfileUseCase {
    constructor(
        private readonly doctorRepository: IDoctorRepository
    ) { }

    async execute(request: GetDoctorProfileRequest): Promise<GetDoctorProfileResponse> {
        // Validate input
        this.validateRequest(request);

        // Find doctor by user ID
        const doctor = await this.doctorRepository.findByUserId(request.userId);

        if (!doctor) {
            throw new AppError('doctor profile not found', 'doctor_NOT_FOUND', 404);
        }

        // Return response
        return {
            success: true,
            message: 'Profile retrieved successfully',
            data: {
                doctorId: doctor.id,
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                email: doctor.email,
                phone: doctor.phone,
                specialization: doctor.specialization,
                licenseNumber: doctor.licenseNumber,
                experience: doctor.experience,
                consultationFee: doctor.consultationFee,
                qualification: doctor.qualification,
                hospital: doctor.hospital,
                availableDays: doctor.availableDays,
                availableTime: doctor.availableTime,
                rating: doctor.rating,
                totalPatients: doctor.totalPatients

            },
            timestamp: new Date().toISOString()
        };
    }

    private validateRequest(request: GetDoctorProfileRequest): void {
        if (!request.userId || request.userId.trim() === '') {
            throw new AppError('User ID is required', 'INVALID_INPUT', 400);
        }
    }
}