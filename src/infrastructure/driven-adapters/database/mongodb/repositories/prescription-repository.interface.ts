
import { Prescription } from '@/domain/entities/prescription.entity';

export interface IPrescriptionRepository {
    create(prescription: any): Promise<Prescription>;
    findAll(
        page: number,
        limit: number,
        doctorId?: string,
        patientId?: string,
        status?: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<{ prescriptions: Prescription[]; total: number }>;
    findById(id: string): Promise<Prescription | null>;
    findByDoctorId(doctorId: string): Promise<Prescription[]>;
    findByPatientId(patientId: string): Promise<Prescription[]>;
    findByAppointmentId(appointmentId: string): Promise<Prescription | null>;
    updateStatus(id: string, status: 'Created' | 'Dispensed' | 'Cancelled'): Promise<Prescription | null>;
    deleteById(id: string): Promise<boolean>;
}
