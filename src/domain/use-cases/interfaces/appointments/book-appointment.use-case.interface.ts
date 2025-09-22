import { BookAppointmentRequest, BookAppointmentResponse } from '@/domain/types/appointments/book-appointment.type';

export interface IBookAppointmentUseCase {
    execute(request: BookAppointmentRequest, patientId: string): Promise<BookAppointmentResponse>;
}