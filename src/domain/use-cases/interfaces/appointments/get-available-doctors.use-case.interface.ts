import { GetAvailableDoctorsRequest, GetAvailableDoctorsResponse } from '@/domain/types/appointments/get-available-doctors.type';

export interface IGetAvailableDoctorsUseCase {
  execute(request: GetAvailableDoctorsRequest): Promise<GetAvailableDoctorsResponse>;
}