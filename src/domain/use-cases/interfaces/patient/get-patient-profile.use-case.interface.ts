import { GetPatientProfileRequest, GetPatientProfileResponse } from '@/domain/types/patient/get-patient-profile.type';

export interface IGetPatientProfileUseCase {
  execute(request: GetPatientProfileRequest): Promise<GetPatientProfileResponse>;
}