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

  async updateByUserId(userId: string, updateData: Partial<Doctor>): Promise<Doctor | null> {
    try {
      const updatedDoc = await this.doctorModel
        .findByIdAndUpdate(userId, updateData, { new: true, lean: true });
      return updatedDoc ? Doctor.fromMongoDocument(updatedDoc) : null;
    } catch (error) {
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

   async findAll(page: number, limit: number): Promise<{ users: Doctor[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
  
      const [docs, total] = await Promise.all([
        this.doctorModel.find().skip(skip).limit(limit).lean(),
        this.doctorModel.countDocuments()
      ]);
  
      return {
        users: docs.map((doc: any) => Doctor.fromMongoDocument(doc)),
        total
      };
    } catch (error) {
      console.log('err', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

}