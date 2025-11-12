import { IPatientRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient-repository.interface';
import { AppError } from '@/shared/errors/app-error';
import { DeletePatientByAdminRequest, DeletePatientByAdminResponse } from '@/domain/types/admin/delete-patient-by-admin.type';
import { IDeletePatientByAdminUseCase } from '../interfaces/admin/delete-patient-by-admin.use-case.interface';

export class DeletePatientByAdminUseCase implements IDeletePatientByAdminUseCase {
    constructor(
        private readonly patientRepository: IPatientRepository
    ) { }

    async execute(patientId: string, request?: DeletePatientByAdminRequest): Promise<DeletePatientByAdminResponse> {
        // Check if patient exists
        const existingPatient = await this.patientRepository.findById(patientId);
        if (!existingPatient) {
            throw new AppError('Patient not found', 'PATIENT_NOT_FOUND', 404);
        }

        // Delete the patient
        const deleted = await this.patientRepository.deleteById(patientId);
        if (!deleted) {
            throw new AppError('Failed to delete patient', 'DELETE_FAILED', 500);
        }

        // Return response
        return {
            success: true,
            message: 'Patient deleted successfully',
            data: {
                patientId,
                deletedAt: new Date().toISOString()
            },
            timestamp: new Date().toISOString()
        };
    }
}