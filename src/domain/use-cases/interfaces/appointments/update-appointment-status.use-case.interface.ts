import { UpdateAppointmentStatusRequest, UpdateAppointmentStatusResponse } from '@/domain/types/appointments/update-appointment-status.type';

export interface IUpdateAppointmentStatusUseCase {
    execute(appointmentId: string, request: UpdateAppointmentStatusRequest): Promise<UpdateAppointmentStatusResponse>;
}