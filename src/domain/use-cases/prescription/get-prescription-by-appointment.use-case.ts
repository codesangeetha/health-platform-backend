import { AppError } from '@/shared/errors/app-error';
import { IGetPrescriptionByAppointmentUseCase } from '../interfaces/prescription/get-prescription-by-appointment.use-case.interface';
import { IPrescriptionRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository.interface';
import { GetPrescriptionResponse } from '@/domain/types/prescription/get-prescription.type';

export class GetPrescriptionByAppointmentUseCase implements IGetPrescriptionByAppointmentUseCase {
    constructor(
        private readonly prescriptionRepository: IPrescriptionRepository
    ) { }

    async execute(appointmentId: string): Promise<GetPrescriptionResponse> {
        // Validate input
        if (!appointmentId) {
            throw new AppError('Appointment ID is required', 'PRESCRIPTION_001', 400);
        }

        const prescription = await this.prescriptionRepository.findByAppointmentId(appointmentId);

        if (!prescription) {
            throw new AppError('Prescription not found for this appointment', 'PRESCRIPTION_002', 404);
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