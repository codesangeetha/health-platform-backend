import { Doctor } from '@/domain/entities/doctor.entity';

export interface IDoctorRepository {
    findByUserId(userId: string): Promise<Doctor | null>;
    updateByUserId(id: string, updateData: Partial<Doctor>): Promise<Doctor | null>;
    findById(id: string): Promise<Doctor | null>;
    findByIdAndUpdate(id: string, updateData: Partial<Doctor>): Promise<Doctor | null>;
findAll(page: number, limit: number, filters?: {
      firstname?: string;
      lastname?: string;
      email?: string;
      specialization?: string;
      createdAt?: string;
      experience?: number;
    }, sort?: string): Promise<{ users: Doctor[]; total: number}>;
    findAvailableDoctors(page:number,limit:number,specialization?:string,availableDays?:string[],searchName?:string): Promise<{ doctors: Doctor[]; total: number}>
    count(): Promise<number>;
    deleteById(id: string): Promise<boolean>;
    deleteByUserId(userId: string): Promise<boolean>;
}