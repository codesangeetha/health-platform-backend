import { AppError } from '@/shared/errors/app-error';
import { EditDoctorProfileRequest, EditDoctorProfileResponse } from '@/domain/types/doctor/edit-doctor-profile.type';
import { IDoctorRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository.interface';
import { IEditDoctorProfileUseCase } from '../interfaces/doctor/edit-doctor-profile.use-case.interface';

export class EditDoctorProfileUseCase implements IEditDoctorProfileUseCase {
    constructor(
        private readonly doctorRepository: IDoctorRepository
    ) { }

    async execute(doctorId: string, request: EditDoctorProfileRequest): Promise<EditDoctorProfileResponse> {
        // Check if at least one field is provided for update
        if (Object.keys(request).length === 0) {
            throw new AppError('At least one field must be provided for update', 'INVALID_INPUT', 400);
        }

        // Find the doctor by ID
        const existingDoctor = await this.doctorRepository.findById(doctorId);
        if (!existingDoctor) {
            throw new AppError('Doctor profile not found', 'DOCTOR_NOT_FOUND', 404);
        }

        // Update the doctor profile
        const updatedDoctor = await this.doctorRepository.findByIdAndUpdate(doctorId, request);
        if (!updatedDoctor) {
            throw new AppError('Failed to update doctor profile', 'UPDATE_FAILED', 500);
        }

        // Get the list of updated fields
        const updatedFields = Object.keys(request).filter(key => request[key as keyof EditDoctorProfileRequest] !== undefined);

        // Return response
        return {
            success: true,
            message: 'Doctor profile updated successfully',
            data: {
                doctorId: updatedDoctor.id,
                firstName: updatedDoctor.firstName,
                lastName: updatedDoctor.lastName,
                email: updatedDoctor.email,
                phone: updatedDoctor.phone,
                updatedFields
            },
            timestamp: new Date().toISOString()
        };
    }
}