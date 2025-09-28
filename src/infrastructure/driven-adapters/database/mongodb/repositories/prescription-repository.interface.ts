
import { Prescription } from '@/domain/entities/prescription.entity';

export interface IPrescriptionRepository {
    create(prescription: any): Promise<Prescription>;
    findAll(
        page: number,
        limit: number,
        doctorId?: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<{ prescriptions: Prescription[]; total: number }>;
    findById(id: string): Promise<Prescription | null>;
    findByDoctorId(doctorId: string): Promise<Prescription[]>;
    deleteById(id: string): Promise<boolean>;
}
