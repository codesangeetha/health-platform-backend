import { UpdateDoctorProfileRequest, UpdateDoctorProfileResponse } from '@/domain/types/doctor/update-doctor-profile.type';

export interface IUpdateDoctorProfileUseCase {
  execute(userId:string,request: UpdateDoctorProfileRequest): Promise<UpdateDoctorProfileResponse>;
}