import { GetDoctorCalendarRequest, GetDoctorCalendarResponse } from '@/domain/types/appointments/get-doctor-calendar.type';

export interface IGetDoctorCalendarUseCase {
    execute(request: GetDoctorCalendarRequest, doctorId: string): Promise<GetDoctorCalendarResponse>;
}