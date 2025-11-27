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


async findAll(page: number, limit: number, filters?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    createdAt?: string;
    bloodGroup?: string;
  }, sort?: string): Promise<{ users: Patient[]; total: number }> {
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
      if (filters?.createdAt) {
        // Handle both single date and date range filtering
        if (typeof filters.createdAt === 'string') {
          // Single date - patients created on or after this date
          filter.createdAt = { $gte: new Date(filters.createdAt) };
        } else if (typeof filters.createdAt === 'object') {
          // Date range object
          filter.createdAt = filters.createdAt;
        }
      }
      if (filters?.bloodGroup) {
        filter.bloodGroup = { $regex: filters.bloodGroup, $options: 'i' }; // Case-insensitive search
      }

      // Apply sorting
      let sortOption: Record<string, 1 | -1> = { createdAt: -1 }; // Default: newest first
      if (sort) {
        const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
        const sortDirection = sort.startsWith('-') ? -1 : 1;
        sortOption = { [sortField]: sortDirection };
      }

      const [docs, total] = await Promise.all([
        this.patientModel.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
        this.patientModel.countDocuments(filter)
      ]);

      return {
        users: docs.map((doc: any) => Patient.fromMongoDocument(doc)),
        total
      };
    } catch (error) {
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

 async findByPhone(phone: string): Promise<Patient | null> {
   try {
     const doc = await this.patientModel.findOne({ phone }).lean();
     return doc ? Patient.fromMongoDocument(doc) : null;
   } catch (error) {
     throw new AppError('Database error', 'DATABASE_ERROR', 500);
   }
 }

 async findByWhatsapp(whatsapp: string): Promise<Patient | null> {
   try {
     const doc = await this.patientModel.findOne({ whatsapp }).lean();
     return doc ? Patient.fromMongoDocument(doc) : null;
   } catch (error) {
     throw new AppError('Database error', 'DATABASE_ERROR', 500);
   }
 }

 async findByEmail(email: string): Promise<Patient | null> {
   try {
     const doc = await this.patientModel.findOne({ email }).lean();
     return doc ? Patient.fromMongoDocument(doc) : null;
   } catch (error) {
     throw new AppError('Database error', 'DATABASE_ERROR', 500);
   }
 }

 async count(): Promise<number> {
   try {
     return await this.patientModel.countDocuments();
   } catch (error) {
     throw new AppError('Database error', 'DATABASE_ERROR', 500);
   }
 }

 async deleteById(id: string): Promise<boolean> {
   try {
     const result = await this.patientModel.findByIdAndDelete(id);
     return !!result;
   } catch (error) {
     throw new AppError('Database error', 'DATABASE_ERROR', 500);
   }
 }

 async deleteByUserId(userId: string): Promise<boolean> {
   try {
     const result = await this.patientModel.findByIdAndDelete(userId);
     return !!result;
   } catch (error) {
     throw new AppError('Database error', 'DATABASE_ERROR', 500);
   }
 }
}