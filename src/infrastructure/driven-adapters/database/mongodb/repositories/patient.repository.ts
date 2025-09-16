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

/* async findAll(): Promise<Patient[]> {
  try {
    const docs = await this.patientModel.find().lean();
    return docs.map((doc: any) => Patient.fromMongoDocument(doc));
  } catch (error) {
    throw new AppError('Database error', 'DATABASE_ERROR', 500);
  }
} */


  async findAll(page: number, limit: number): Promise<{ users: Patient[]; total: number }> {
  try {
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.patientModel.find().skip(skip).limit(limit).lean(),
      this.patientModel.countDocuments()
    ]);

    return {
      users: docs.map((doc: any) => Patient.fromMongoDocument(doc)),
      total
    };
  } catch (error) {
    throw new AppError('Database error', 'DATABASE_ERROR', 500);
  }
}


}