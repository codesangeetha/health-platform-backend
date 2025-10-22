import { IGetPatientProfileUseCase } from '../interfaces/patient/get-patient-profile.use-case.interface';
import { IPatientRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient-repository.interface';
import { GetPatientProfileRequest, GetPatientProfileResponse } from '@/domain/types/patient/get-patient-profile.type';
import { AppError } from '@/shared/errors/app-error';

export class GetPatientProfileUseCase implements IGetPatientProfileUseCase {
  constructor(
    private readonly patientRepository: IPatientRepository
  ) {}

  async execute(request: GetPatientProfileRequest): Promise<GetPatientProfileResponse> {
    // Validate input
    this.validateRequest(request);

    // Find patient by user ID
    const patient = await this.patientRepository.findByUserId(request.userId);
    
    if (!patient) {
      throw new AppError('Patient profile not found', 'PATIENT_NOT_FOUND', 404);
    }

    // Return response
    return {
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        patientId: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        whatsapp:patient.whatsapp,
        dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0],
        bloodGroup: patient.bloodGroup,
        allergies: patient.allergies,
        chronicDiseases: patient.chronicDiseases,
        emergencyContact: patient.emergencyContact
      },
      timestamp: new Date().toISOString()
    };
  }

  private validateRequest(request: GetPatientProfileRequest): void {
    if (!request.userId || request.userId.trim() === '') {
      throw new AppError('User ID is required', 'INVALID_INPUT', 400);
    }
  }
}