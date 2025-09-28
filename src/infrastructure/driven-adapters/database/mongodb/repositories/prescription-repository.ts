// src/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository.ts
import { AppError } from '@/shared/errors/app-error';
import { Prescription } from '@/domain/entities/prescription.entity';
import { IPrescriptionRepository } from './prescription-repository.interface';

export class PrescriptionRepositoryMongoDB implements IPrescriptionRepository {
  constructor(private readonly prescriptionModel: any) {}

  async create(prescription: any): Promise<Prescription> {
    try {
      // Save into MongoDB
      const doc = await this.prescriptionModel.create(prescription);

      // Convert back to entity
      return Prescription.fromMongoDocument(doc.toObject());
    } catch (error) {
      console.error("Database error (create prescription):", error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findAll(
    page: number,
    limit: number,
    doctorId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ prescriptions: Prescription[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build filter conditions dynamically
      const filter: any = {};
      if (doctorId) filter.doctorId = doctorId;
      if (startDate || endDate) {
        filter.uploadDate = {};
        if (startDate) filter.uploadDate.$gte = startDate;
        if (endDate) filter.uploadDate.$lte = endDate;
      }

      // Fetch data & count total
      const [docs, total] = await Promise.all([
        this.prescriptionModel.find(filter)
          .populate('doctorId', 'name email') // Populate doctor details
          .sort({ uploadDate: -1 }) // Most recent first
          .skip(skip)
          .limit(limit)
          .lean(),
        this.prescriptionModel.countDocuments(filter),
      ]);

      // Convert documents to entities
      const prescriptions = docs.map((doc: any) => Prescription.fromMongoDocument(doc));

      return { prescriptions, total };
    } catch (error) {
      console.error('Database error (findAll prescriptions):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findById(id: string): Promise<Prescription | null> {
    try {
      const doc = await this.prescriptionModel.findById(id)
        .populate('doctorId', 'name email')
        .lean();
      
      if (!doc) return null;
      
      return Prescription.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (findById prescription):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByDoctorId(doctorId: string): Promise<Prescription[]> {
    try {
      const docs = await this.prescriptionModel.find({ doctorId })
        .populate('doctorId', 'name email')
        .sort({ uploadDate: -1 })
        .lean();

      return docs.map((doc: any) => Prescription.fromMongoDocument(doc));
    } catch (error) {
      console.error('Database error (findByDoctorId prescription):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.prescriptionModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Database error (deleteById prescription):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }
}
