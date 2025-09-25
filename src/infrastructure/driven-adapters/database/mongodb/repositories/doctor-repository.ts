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

  async findAvailableDoctors(
 page: number,
 limit: number,
 specialization?: string,
 availableDays?: string[],
 searchName?: string
): Promise<{ doctors: Doctor[]; total: number }> {
 try {
   const skip = (page - 1) * limit;

   // build query object dynamically
   const query: any = {};
   if (specialization) {
     query.specialization = specialization;
   }
   if (availableDays) {
     // Ensure availableDays is always an array
     const daysArray = Array.isArray(availableDays) ? availableDays : [availableDays];
     query.$or = daysArray.map(day => ({
       availableDays: { $regex: new RegExp(`^${day}$`, 'i') }
     }));
   }
   if (searchName) {
     // Search in both first and last name
     query.$or = [
       { firstName: { $regex: searchName, $options: 'i' } },
       { lastName: { $regex: searchName, $options: 'i' } }
     ];
   }

   const [docs, total] = await Promise.all([
     this.doctorModel.find(query).skip(skip).limit(limit).lean(),
     this.doctorModel.countDocuments(query),
   ]);

   return {
     doctors: docs.map((doc: any) => Doctor.fromMongoDocument(doc)),
     total,
   };
 } catch (error) {
   console.log("err", error);
   throw new AppError("Database error", "DATABASE_ERROR", 500);
 }
}

async findById(id: string): Promise<Doctor | null> {
    try {
        const doc = await this.doctorModel.findById(id).lean();
        return doc ? Doctor.fromMongoDocument(doc) : null;
    } catch (error) {
        throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
}


}