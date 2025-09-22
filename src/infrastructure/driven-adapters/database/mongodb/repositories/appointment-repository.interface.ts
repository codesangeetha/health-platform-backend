import { Appointment } from '@/domain/entities/appointment.entity';

export interface IAppointmentRepository {
    create(appointment: any): Promise<Appointment>;
    findAll(
        page: number,
        limit: number,
        status?: 'pending' | 'confirmed' | 'cancelled' | 'completed',
        patientId?: string
    ): Promise<{ appointments: Appointment[]; total: number }>;

    update(
        appointmentId: string,
        updates: { newDate?: string; newTime?: string; reason?: string }
    ): Promise<Appointment | null>;
}
