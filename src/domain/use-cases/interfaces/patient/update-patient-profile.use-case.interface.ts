import { UpdatePatientProfileRequest, UpdatePatientProfileResponse } from '@/domain/types/patient/update-patient-profile.type';

export interface IUpdatePatientProfileUseCase {
  execute(userId:string,request: UpdatePatientProfileRequest): Promise<UpdatePatientProfileResponse>;
}