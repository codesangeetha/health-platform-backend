import { GetDoctorDetailsRequest, GetDoctorDetailsResponse } from '@/domain/types/appointments/get-doctor-details.type';

export interface IGetDoctorDetailsUseCase {
    execute(request: GetDoctorDetailsRequest): Promise<GetDoctorDetailsResponse>;
}