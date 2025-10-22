import { AppError } from '@/shared/errors/app-error';
import { IUpdatePrescriptionUseCase } from '../interfaces/prescription/update-prescription.use-case.interface';
import { IPrescriptionRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository.interface';
import { UpdatePrescriptionRequest, UpdatePrescriptionResponse } from '@/domain/types/prescription/update-prescription.type';

export class UpdatePrescriptionUseCase implements IUpdatePrescriptionUseCase {
    constructor(
        private readonly prescriptionRepository: IPrescriptionRepository
    ) { }

    async execute(prescriptionId: string, request: UpdatePrescriptionRequest, doctorId: string): Promise<UpdatePrescriptionResponse> {
        // Validate input
        if (!prescriptionId) {
            throw new AppError('Prescription ID is required', 'PRESCRIPTION_001', 400);
        }

        if (!doctorId) {
            throw new AppError('Doctor authentication required', 'AUTHENTICATION_REQUIRED', 401);
        }

        // Check if prescription exists
        const existingPrescription = await this.prescriptionRepository.findById(prescriptionId);
        if (!existingPrescription) {
            throw new AppError('Prescription not found', 'PRESCRIPTION_002', 404);
        }

        // Verify the doctor owns this prescription
        if (existingPrescription.doctorId !== doctorId) {
            throw new AppError('Unauthorized to update this prescription', 'PRESCRIPTION_003', 403);
        }

        // Validate medicines if provided
        if (request.medicines) {
            this.validateMedicines(request.medicines);
        }

        // Update the prescription
        const updatedData = {
            ...(request.diagnosis && { diagnosis: request.diagnosis }),
            ...(request.notes !== undefined && { notes: request.notes }),
            ...(request.medicines && { medicines: request.medicines }),
            ...(request.tests !== undefined && { tests: request.tests }),
            ...(request.status && { status: request.status })
        };

        const updatedPrescription = await this.prescriptionRepository.create({
            ...existingPrescription.toMongoDocument(),
            ...updatedData
        });

        return {
            success: true,
            message: 'Prescription updated successfully',
            data: {
                _id: updatedPrescription.id,
                appointmentId: updatedPrescription.appointmentId,
                doctorId: updatedPrescription.doctorId,
                patientId: updatedPrescription.patientId,
                diagnosis: updatedPrescription.diagnosis,
                ...(updatedPrescription.notes && { notes: updatedPrescription.notes }),
                medicines: updatedPrescription.medicines,
                ...(updatedPrescription.tests && { tests: updatedPrescription.tests }),
                status: updatedPrescription.status,
                createdAt: updatedPrescription.createdAt.toISOString(),
                updatedAt: updatedPrescription.updatedAt.toISOString()
            }
        };
    }

    private validateMedicines(medicines: any[]): void {
        if (!Array.isArray(medicines) || medicines.length === 0) {
            throw new AppError('At least one medicine is required', 'PRESCRIPTION_001', 400);
        }

        for (let i = 0; i < medicines.length; i++) {
            const medicine = medicines[i];
            if (!medicine) {
                throw new AppError(`Medicine ${i + 1} is undefined`, 'PRESCRIPTION_001', 400);
            }

            const medicineFields = ['medicineId', 'dosage', 'timing', 'duration', 'mealTime'];
            for (const field of medicineFields) {
                if (!medicine[field as keyof typeof medicine]) {
                    throw new AppError(`Missing required field in medicine ${i + 1}: ${field}`, 'PRESCRIPTION_001', 400);
                }
            }

            if (!Array.isArray(medicine.timing) || medicine.timing.length === 0) {
                throw new AppError(`Medicine ${i + 1} must have at least one timing slot`, 'PRESCRIPTION_001', 400);
            }

            if (medicine.duration < 1) {
                throw new AppError(`Medicine ${i + 1} duration must be at least 1 day`, 'PRESCRIPTION_001', 400);
            }

            if (!['before meal', 'after meal', 'with meal'].includes(medicine.mealTime)) {
                throw new AppError(`Medicine ${i + 1} mealTime must be 'before meal', 'after meal', or 'with meal'`, 'PRESCRIPTION_001', 400);
            }
        }
    }
}