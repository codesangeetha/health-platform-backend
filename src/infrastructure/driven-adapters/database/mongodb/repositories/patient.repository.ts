import { IPatientRepository } from './patient-repository.interface';
import { Patient } from '@/domain/entities/patient.entity';
import { AppError } from '@/shared/errors/app-error';

export class PatientRepositoryMongoDB implements IPatientRepository {
  constructor(private readonly patientModel: any) { }

  async findByUserId(userId: string): Promise<Patient | null> {
    try {
      const doc = await this.patientModel.findById(userId).lean();
      return doc ? Patient.fromMongoDocument(doc) : null;
    } catch (error) {
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findById(id: string): Promise<Patient | null> {
    try {
      const doc = await this.patientModel.findById(id).lean();
      return doc ? Patient.fromMongoDocument(doc) : null;
    } catch (error) {
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async updateByUserId(userId: string, updateData: Partial<Patient>): Promise<Patient | null> {
  try {
    const doc = await this.patientModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, lean: true } 
    );

    return doc ? Patient.fromMongoDocument(doc) : null;
  } catch (error) {
    throw new AppError('Database error', 'DATABASE_ERROR', 500);
  }
}

}