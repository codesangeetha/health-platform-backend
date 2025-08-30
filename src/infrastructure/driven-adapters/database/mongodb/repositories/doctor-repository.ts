import { IDoctorRepository } from './doctor-repository.interface';
import { Doctor } from '@/domain/entities/doctor.entity';
import { AppError } from '@/shared/errors/app-error';

export class DoctorRepositoryMongoDB implements IDoctorRepository {
  constructor(private readonly doctorModel: any) { }

  async findByUserId(userId: string): Promise<Doctor | null> {
    try {
      const doc = await this.doctorModel.findById(userId).lean();
      return doc ? Doctor.fromMongoDocument(doc) : null;
    } catch (error) {
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async updateByUserId(userId: string,updateData: Partial<Doctor>): Promise<Doctor | null> {
  try {
    const updatedDoc = await this.doctorModel
      .findByIdAndUpdate(userId, updateData, { new: true, lean: true });

    return updatedDoc ? Doctor.fromMongoDocument(updatedDoc) : null;
  } catch (error) {
    throw new AppError('Database error', 'DATABASE_ERROR', 500);
  }
}

}