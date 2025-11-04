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

   async findAll(page: number, limit: number, filters?: {
     firstname?: string;
     lastname?: string;
     email?: string;
     specialization?: string;
     createdAt?: string;
     experience?: number;
   }): Promise<{ users: Doctor[]; total: number }> {
     try {
       const skip = (page - 1) * limit;

       // Build filter object for MongoDB query
       const filter: any = {};
       
       if (filters?.firstname) {
         filter.firstName = { $regex: filters.firstname, $options: 'i' }; // Case-insensitive search
       }
       if (filters?.lastname) {
         filter.lastName = { $regex: filters.lastname, $options: 'i' }; // Case-insensitive search
       }
       if (filters?.email) {
         filter.email = { $regex: filters.email, $options: 'i' }; // Case-insensitive search
       }
       if (filters?.specialization) {
         filter.specialization = { $regex: filters.specialization, $options: 'i' }; // Case-insensitive search
       }
       if (filters?.experience) {
         filter.experience = filters.experience; // Exact match for experience
       }
       if (filters?.createdAt) {
         // Filter by creation date (doctors created on or after this date)
         filter.createdAt = { $gte: new Date(filters.createdAt) };
       }

       const [docs, total] = await Promise.all([
         this.doctorModel.find(filter).skip(skip).limit(limit).lean(),
         this.doctorModel.countDocuments(filter)
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
   const orConditions: any[] = [];

   if (specialization) {
     query.specialization = specialization;
   }
   if (availableDays && availableDays.length > 0) {
     // Ensure availableDays is always an array
     const daysArray = Array.isArray(availableDays) ? availableDays : [availableDays];
     const dayConditions = daysArray.map(day => ({
       availableDays: { $regex: new RegExp(`^${day}$`, 'i') }
     }));
     orConditions.push(...dayConditions);
   }
   if (searchName) {
     // Search in both first and last name
     const nameConditions = [
       { firstName: { $regex: searchName, $options: 'i' } },
       { lastName: { $regex: searchName, $options: 'i' } }
     ];
     orConditions.push(...nameConditions);
   }

   // Only add $or if we have conditions
   if (orConditions.length > 0) {
     query.$or = orConditions;
   }

   console.log('Doctor query:', JSON.stringify(query, null, 2));
   console.log('Available doctors in DB:');

   const [docs, total] = await Promise.all([
     this.doctorModel.find(query).skip(skip).limit(limit).lean(),
     this.doctorModel.countDocuments(query),
   ]);

   console.log(`Found ${total} doctors matching query`);
   console.log('Doctor documents:', docs);

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

async count(): Promise<number> {
    try {
        return await this.doctorModel.countDocuments();
    } catch (error) {
        throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
}


}