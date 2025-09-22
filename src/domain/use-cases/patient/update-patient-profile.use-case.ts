import { IPatientRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient-repository.interface';
import { AppError } from '@/shared/errors/app-error';
import { UpdatePatientProfileRequest, UpdatePatientProfileResponse } from '@/domain/types/patient/update-patient-profile.type';
import { IUpdatePatientProfileUseCase } from '../interfaces/patient/update-patient-profile.use-case.interface';

export class UpdatePatientProfileUseCase implements IUpdatePatientProfileUseCase {
    constructor(
        private readonly patientRepository: IPatientRepository
    ) { }

    async execute(userId: string, request: UpdatePatientProfileRequest): Promise<UpdatePatientProfileResponse> {
        // Validate input
        this.validateRequest(request);

        // Find patient by user ID
        const patient = await this.patientRepository.updateByUserId(userId, request);

        if (!patient) {
            throw new AppError('Patient profile not found', 'PATIENT_NOT_FOUND', 404);
        }

        // Return response
        return {
            success: true,
            message: 'Profile updated successfully',
            data: {
                patientId: patient.id,
                firstName: patient.firstName,
                lastName: patient.lastName,
                email: patient.email,
                phone: patient.phone,
                whatsapp:patient.whatsapp
            },
            timestamp: new Date().toISOString()
        };
    }

    private validateRequest(request: UpdatePatientProfileRequest): void {
        if (!request.firstName || !request.lastName || !request.phone || !request.bloodGroup || !request.allergies || !request.chronicDiseases || !request.emergencyContact) {
            throw new AppError('Invalid input data', 'USER_001', 400);
        }

    }
}