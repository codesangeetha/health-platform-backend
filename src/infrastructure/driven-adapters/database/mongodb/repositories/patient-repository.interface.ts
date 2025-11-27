import { Patient } from '@/domain/entities/patient.entity';

export interface IPatientRepository {
  findByUserId(userId: string): Promise<Patient | null>;
  findById(id: string): Promise<Patient | null>;
  updateByUserId(id: string,updateData: Partial<Patient>): Promise<Patient | null>;
findAll(page: number, limit: number, filters?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    createdAt?: string | { $gte?: Date; $lte?: Date };
    bloodGroup?: string;
  }, sort?: string): Promise<{ users: Patient[]; total: number}>;
  findByPhone(phone: string): Promise<Patient | null>;
  findByWhatsapp(whatsapp: string): Promise<Patient | null>;
  findByEmail(email: string): Promise<Patient | null>;
  count(): Promise<number>;
  deleteById(id: string): Promise<boolean>;
  deleteByUserId(userId: string): Promise<boolean>;
}