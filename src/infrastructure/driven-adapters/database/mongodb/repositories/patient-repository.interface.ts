import { Patient } from '@/domain/entities/patient.entity';

export interface IPatientRepository {
  findByUserId(userId: string): Promise<Patient | null>;
  findById(id: string): Promise<Patient | null>;
  updateByUserId(id: string,updateData: Partial<Patient>): Promise<Patient | null>;
}