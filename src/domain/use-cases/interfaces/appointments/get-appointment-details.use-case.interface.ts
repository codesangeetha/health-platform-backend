import { GetAppointmentDetailsRequest, GetAppointmentDetailsResponse } from '@/domain/types/appointments/get-appointment-details.type';

export interface IGetAppointmentDetailsUseCase {
    execute(request: GetAppointmentDetailsRequest): Promise<GetAppointmentDetailsResponse>;
}