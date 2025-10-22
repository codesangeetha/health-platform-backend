import { GetDoctorAppointmentsRequest, GetDoctorAppointmentsResponse } from '@/domain/types/appointments/get-doctor-appointments.type';

export interface IGetDoctorAppointmentsUseCase {
    execute(request: GetDoctorAppointmentsRequest, doctorId: string): Promise<GetDoctorAppointmentsResponse>;
}