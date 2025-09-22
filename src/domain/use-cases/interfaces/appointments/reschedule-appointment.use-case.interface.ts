import { RescheduleAppointmentRequest, RescheduleAppointmentResponse } from '@/domain/types/appointments/reschedule-appointment.type';

export interface IRescheduleAppointmentUseCase {
    execute(appointmentId: string, request: RescheduleAppointmentRequest): Promise<RescheduleAppointmentResponse>;
}