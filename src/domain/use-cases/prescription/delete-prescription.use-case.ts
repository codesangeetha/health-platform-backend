import { AppError } from '@/shared/errors/app-error';
import { IDeletePrescriptionUseCase } from '../interfaces/prescription/delete-prescription.use-case.interface';
import { IPrescriptionRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository.interface';
import { DeletePrescriptionResponse } from '@/domain/types/prescription/delete-prescription.type';

export class DeletePrescriptionUseCase implements IDeletePrescriptionUseCase {
    constructor(
        private readonly prescriptionRepository: IPrescriptionRepository
    ) { }

    async execute(prescriptionId: string): Promise<DeletePrescriptionResponse> {
        // Validate input
        if (!prescriptionId) {
            throw new AppError('Prescription ID is required', 'PRESCRIPTION_001', 400);
        }

        // Check if prescription exists
        const existingPrescription = await this.prescriptionRepository.findById(prescriptionId);
        if (!existingPrescription) {
            throw new AppError('Prescription not found', 'PRESCRIPTION_002', 404);
        }

        // Delete the prescription
        const deleted = await this.prescriptionRepository.deleteById(prescriptionId);

        if (!deleted) {
            throw new AppError('Failed to delete prescription', 'PRESCRIPTION_004', 500);
        }

        return {
            success: true,
            message: 'Prescription deleted successfully',
            data: {
                deleted: true,
                prescriptionId: prescriptionId
            }
        };
    }
}