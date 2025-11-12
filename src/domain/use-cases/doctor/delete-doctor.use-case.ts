import { AppError } from '@/shared/errors/app-error';
import { DeleteDoctorRequest, DeleteDoctorResponse } from '@/domain/types/doctor/delete-doctor.type';
import { IDoctorRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository.interface';
import { IDeleteDoctorUseCase } from '../interfaces/doctor/delete-doctor.use-case.interface';

export class DeleteDoctorUseCase implements IDeleteDoctorUseCase {
    constructor(
        private readonly doctorRepository: IDoctorRepository
    ) { }

    async execute(doctorId: string, request: DeleteDoctorRequest): Promise<DeleteDoctorResponse> {
        // Validate doctor ID
        if (!doctorId) {
            throw new AppError('Doctor ID is required', 'INVALID_INPUT', 400);
        }

        // Check if doctor exists
        const existingDoctor = await this.doctorRepository.findById(doctorId);
        if (!existingDoctor) {
            throw new AppError('Doctor not found', 'DOCTOR_NOT_FOUND', 404);
        }

        // Delete the doctor
        const deleted = await this.doctorRepository.deleteById(doctorId);
        if (!deleted) {
            throw new AppError('Failed to delete doctor', 'DELETE_FAILED', 500);
        }

        // Return response
        return {
            success: true,
            message: 'Doctor deleted successfully',
            data: {
                doctorId: doctorId,
                deletedAt: new Date().toISOString()
            },
            timestamp: new Date().toISOString()
        };
    }
}