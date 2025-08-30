import { GetDoctorProfileRequest, GetDoctorProfileResponse } from '@/domain/types/doctor/get-doctor-profile.type';

export interface IGetDoctorProfileUseCase {
    execute(request: GetDoctorProfileRequest): Promise<GetDoctorProfileResponse>;
}