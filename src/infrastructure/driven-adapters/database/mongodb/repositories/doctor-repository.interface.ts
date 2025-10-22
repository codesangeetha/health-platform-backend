import { Doctor } from '@/domain/entities/doctor.entity';

export interface IDoctorRepository {
    findByUserId(userId: string): Promise<Doctor | null>;
    updateByUserId(id: string, updateData: Partial<Doctor>): Promise<Doctor | null>;
    findAll(page: number, limit: number, firstname?: string, lastname?: string): Promise<{ users: Doctor[]; total: number}>;
    findAvailableDoctors(page:number,limit:number,specialization?:string,availableDays?:string[],searchName?:string): Promise<{ doctors: Doctor[]; total: number}>
    findById(id: string): Promise<Doctor | null>; // Add this method
}