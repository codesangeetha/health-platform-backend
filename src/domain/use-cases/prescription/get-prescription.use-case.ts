import { AppError } from '@/shared/errors/app-error';
import { IGetPrescriptionUseCase } from '../interfaces/prescription/get-prescription.use-case.interface';
import { IPrescriptionRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository.interface';
import { GetPrescriptionResponse } from '@/domain/types/prescription/get-prescription.type';

export class GetPrescriptionUseCase implements IGetPrescriptionUseCase {
    constructor(
        private readonly prescriptionRepository: IPrescriptionRepository
    ) { }

    async execute(prescriptionId: string): Promise<GetPrescriptionResponse> {
        // Validate input
        if (!prescriptionId) {
            throw new AppError('Prescription ID is required', 'PRESCRIPTION_001', 400);
        }

        const prescription = await this.prescriptionRepository.findById(prescriptionId);

        if (!prescription) {
            throw new AppError('Prescription not found', 'PRESCRIPTION_002', 404);
        }

        return {
            success: true,
            message: 'Prescription retrieved successfully',
            data: {
                _id: prescription.id,
                appointmentId: prescription.appointmentId,
                doctorId: prescription.doctorId,
                patientId: prescription.patientId,
                diagnosis: prescription.diagnosis,
                ...(prescription.notes && { notes: prescription.notes }),
                medicines: prescription.medicines,
                ...(prescription.tests && { tests: prescription.tests }),
                status: prescription.status,
                createdAt: prescription.createdAt.toISOString(),
                updatedAt: prescription.updatedAt.toISOString()
            }
        };
    }
}