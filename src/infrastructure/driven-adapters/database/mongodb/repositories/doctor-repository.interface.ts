import { Doctor } from '@/domain/entities/doctor.entity';

export interface IDoctorRepository {
    findByUserId(userId: string): Promise<Doctor | null>;
    updateByUserId(id: string, updateData: Partial<Doctor>): Promise<Doctor | null>;
    findAll(page: number, limit: number): Promise<{ users: Doctor[]; total: number}>;
}