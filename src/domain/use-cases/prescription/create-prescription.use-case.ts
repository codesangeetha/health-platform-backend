import { AppError } from '@/shared/errors/app-error';
import { ICreatePrescriptionUseCase } from '../interfaces/prescription/create-prescription.use-case.interface';
import { IPrescriptionRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository.interface';
import { CreatePrescriptionRequest, CreatePrescriptionResponse } from '@/domain/types/prescription/create-prescription.type';
import { Prescription } from '@/domain/entities/prescription.entity';

export class CreatePrescriptionUseCase implements ICreatePrescriptionUseCase {
    constructor(
        private readonly prescriptionRepository: IPrescriptionRepository
    ) { }

    async execute(request: CreatePrescriptionRequest, doctorId: string): Promise<CreatePrescriptionResponse> {
        // Validate input
        this.validatePrescriptionRequest(request);

        let savedPrescription;

        const prescriptionData = {
            appointmentId: request.appointmentId,
            doctorId: doctorId,
            patientId: request.patientId,
            diagnosis: request.diagnosis,
            notes: request.notes,
            medicines: request.medicines,
            tests: request.tests,
            status: 'Created' as const
        };

        savedPrescription = await this.prescriptionRepository.create(prescriptionData);

        return {
            success: true,
            message: 'Prescription created successfully',
            data: {
                _id: savedPrescription.id,
                appointmentId: savedPrescription.appointmentId,
                doctorId: savedPrescription.doctorId,
                patientId: savedPrescription.patientId,
                status: savedPrescription.status
            }
        };
    }

    private validatePrescriptionRequest(request: CreatePrescriptionRequest): void {
        const requiredFields = ['appointmentId', 'patientId', 'diagnosis', 'medicines'];
        for (const field of requiredFields) {
            if (!request[field as keyof typeof request]) {
                throw new AppError(`Missing required field: ${field}`, 'PRESCRIPTION_001', 400);
            }
        }

        // Validate medicines array
        if (!Array.isArray(request.medicines) || request.medicines.length === 0) {
            throw new AppError('At least one medicine is required', 'PRESCRIPTION_001', 400);
        }

        // Validate each medicine
        for (let i = 0; i < request.medicines.length; i++) {
            const medicine = request.medicines[i];
            if (!medicine) {
                throw new AppError(`Medicine ${i + 1} is undefined`, 'PRESCRIPTION_001', 400);
            }

            const medicineFields = ['medicineId', 'dosage', 'timing', 'duration', 'mealTime'];
            for (const field of medicineFields) {
                if (!medicine[field as keyof typeof medicine]) {
                    throw new AppError(`Missing required field in medicine ${i + 1}: ${field}`, 'PRESCRIPTION_001', 400);
                }
            }

            // Validate timing array
            if (!Array.isArray(medicine.timing) || medicine.timing.length === 0) {
                throw new AppError(`Medicine ${i + 1} must have at least one timing slot`, 'PRESCRIPTION_001', 400);
            }

            // Validate duration
            if (medicine.duration < 1) {
                throw new AppError(`Medicine ${i + 1} duration must be at least 1 day`, 'PRESCRIPTION_001', 400);
            }

            // Validate mealTime
            if (!['before meal', 'after meal', 'with meal'].includes(medicine.mealTime)) {
                throw new AppError(`Medicine ${i + 1} mealTime must be 'before meal', 'after meal', or 'with meal'`, 'PRESCRIPTION_001', 400);
            }
        }

        // Validate tests array if provided
        if (request.tests && !Array.isArray(request.tests)) {
            throw new AppError('Tests must be an array', 'PRESCRIPTION_001', 400);
        }
    }
}