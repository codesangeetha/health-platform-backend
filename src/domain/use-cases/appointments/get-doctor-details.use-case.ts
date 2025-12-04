import { AppError } from '@/shared/errors/app-error';
import { IGetDoctorDetailsUseCase } from '../interfaces/appointments/get-doctor-details.use-case.interface';
import { IDoctorRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository.interface';
import { GetDoctorDetailsRequest, GetDoctorDetailsResponse } from '@/domain/types/appointments/get-doctor-details.type';

export class GetDoctorDetailsUseCase implements IGetDoctorDetailsUseCase {
    constructor(
        private readonly doctorRepository: IDoctorRepository
    ) { }

    async execute(request: GetDoctorDetailsRequest): Promise<GetDoctorDetailsResponse> {
        // Validate input
        this.validateRequest(request);

        // Find doctor by ID
        const doctor = await this.doctorRepository.findById(request.doctorId);

        if (!doctor) {
            throw new AppError('Doctor not found', 'DOCTOR_NOT_FOUND', 404);
        }

        // Return response
        const responseData: any = {
            doctorId: doctor.id,
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            email: doctor.email,
            phone: doctor.phone,
            whatsapp: doctor.whatsapp,
            specialization: doctor.specialization,
            licenseNumber: doctor.licenseNumber,
            experience: doctor.experience,
            consultationFee: doctor.consultationFee,
            qualification: doctor.qualification,
            availableDays: doctor.availableDays,
            availableTime: doctor.availableTime,
            rating: doctor.rating,
            totalPatients: doctor.totalPatients,
            isActive: doctor.isActive
        };

        // Only include hospital field if it exists
        if (doctor.hospital) {
            responseData.hospital = doctor.hospital;
        }

        return {
            success: true,
            message: 'Doctor details retrieved successfully',
            data: responseData,
            timestamp: new Date().toISOString()
        };
    }

    private validateRequest(request: GetDoctorDetailsRequest): void {
        if (!request.doctorId || request.doctorId.trim() === '') {
            throw new AppError('Doctor ID is required', 'INVALID_INPUT', 400);
        }
    }
}