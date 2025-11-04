import { Appointment } from '@/domain/entities/appointment.entity';

export interface IAppointmentRepository {
    create(appointment: any): Promise<Appointment>;
    findAll(
        page: number,
        limit: number,
        status?: 'pending' | 'confirmed' | 'cancelled' | 'completed',
        patientId?: string
    ): Promise<{ appointments: Appointment[]; total: number }>;
    
    findAllByDoctor(
        page: number,
        limit: number,
        date?: string,
        status?: 'pending' | 'confirmed' | 'cancelled' | 'completed',
        doctorId?: string
    ): Promise<{ appointments: Appointment[]; total: number }>;

    update(
        appointmentId: string,
        updates: { newDate?: string; newTime?: string; reason?: string }
    ): Promise<Appointment | null>;
    
    updateStatus(
        appointmentId: string,
        updates: { status: 'pending' | 'confirmed' | 'cancelled' | 'completed'; reason?: string }
    ): Promise<Appointment | null>;

    findById(id: string): Promise<Appointment | null>; // Add this method
    count(): Promise<number>;

    // Patient dashboard methods
    countUpcomingAppointmentsByPatient(patientId: string): Promise<number>;
    countAllAppointmentsByPatient(patientId: string): Promise<number>;
    getLastVisitDateByPatient(patientId: string): Promise<Date | null>;

    // Doctor dashboard methods
    countTodayAppointmentsByDoctor(doctorId: string): Promise<number>;
    countAllAppointmentsByDoctor(doctorId: string): Promise<number>;
    countPendingConsultationsByDoctor(doctorId: string): Promise<number>;
    countTodayCompletedConsultationsByDoctor(doctorId: string): Promise<number>;
}
