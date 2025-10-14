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
    patientId?: string,
    status?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ prescriptions: Prescription[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build filter conditions dynamically
      const filter: any = {};
      if (doctorId) filter.doctorId = doctorId;
      if (patientId) filter.patientId = patientId;
      if (status) filter.status = status;
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = startDate;
        if (endDate) filter.createdAt.$lte = endDate;
      }

      // Fetch data & count total
      const [docs, total] = await Promise.all([
        this.prescriptionModel.find(filter)
          .populate('doctorId', 'name email')
          .populate('patientId', 'name email')
          .populate('appointmentId', 'appointmentDate')
          .sort({ createdAt: -1 }) // Most recent first
          .skip(skip)
          .limit(limit)
          .lean(),
        this.prescriptionModel.countDocuments(filter),
      ]);

      // Convert documents to entities
      const prescriptions = docs.map((doc: any) => {
        // Ensure populated fields are properly handled
        if (doc.doctorId && typeof doc.doctorId === 'object' && doc.doctorId._id) {
          doc.doctorId = doc.doctorId._id;
        } else if (doc.doctorId && typeof doc.doctorId === 'object' && doc.doctorId.$oid) {
          doc.doctorId = doc.doctorId.$oid;
        }

        if (doc.patientId && typeof doc.patientId === 'object' && doc.patientId._id) {
          doc.patientId = doc.patientId._id;
        } else if (doc.patientId && typeof doc.patientId === 'object' && doc.patientId.$oid) {
          doc.patientId = doc.patientId.$oid;
        }

        if (doc.appointmentId && typeof doc.appointmentId === 'object' && doc.appointmentId._id) {
          doc.appointmentId = doc.appointmentId._id;
        } else if (doc.appointmentId && typeof doc.appointmentId === 'object' && doc.appointmentId.$oid) {
          doc.appointmentId = doc.appointmentId.$oid;
        }

        return Prescription.fromMongoDocument(doc);
      });

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
        .populate('patientId', 'name email')
        .populate('appointmentId', 'appointmentDate')
        .lean();

      if (!doc) return null;

      // Ensure populated fields are properly handled
      if (doc.doctorId && typeof doc.doctorId === 'object' && doc.doctorId._id) {
        doc.doctorId = doc.doctorId._id;
      } else if (doc.doctorId && typeof doc.doctorId === 'object' && doc.doctorId.$oid) {
        doc.doctorId = doc.doctorId.$oid;
      }

      if (doc.patientId && typeof doc.patientId === 'object' && doc.patientId._id) {
        doc.patientId = doc.patientId._id;
      } else if (doc.patientId && typeof doc.patientId === 'object' && doc.patientId.$oid) {
        doc.patientId = doc.patientId.$oid;
      }

      if (doc.appointmentId && typeof doc.appointmentId === 'object' && doc.appointmentId._id) {
        doc.appointmentId = doc.appointmentId._id;
      } else if (doc.appointmentId && typeof doc.appointmentId === 'object' && doc.appointmentId.$oid) {
        doc.appointmentId = doc.appointmentId.$oid;
      }

      return Prescription.fromMongoDocument(doc);
    } catch (error: any) {
      console.error('Database error (findById prescription):', error);

      // Handle specific prescription data errors
      if (error.message === 'PRESCRIPTION_NOT_FOUND') {
        return null;
      }

      if (error.message === 'PRESCRIPTION_INVALID_ID') {
        throw new AppError('Invalid prescription ID', 'PRESCRIPTION_INVALID_ID', 400);
      }

      if (error.message === 'PRESCRIPTION_MISSING_APPOINTMENT') {
        throw new AppError('Prescription is missing appointment information', 'PRESCRIPTION_MISSING_APPOINTMENT', 400);
      }

      if (error.message === 'PRESCRIPTION_MISSING_DOCTOR') {
        throw new AppError('Prescription is missing doctor information', 'PRESCRIPTION_MISSING_DOCTOR', 400);
      }

      if (error.message === 'PRESCRIPTION_MISSING_PATIENT') {
        throw new AppError('Prescription is missing patient information', 'PRESCRIPTION_MISSING_PATIENT', 400);
      }

      if (error.message === 'PRESCRIPTION_MISSING_DIAGNOSIS') {
        throw new AppError('Prescription is missing diagnosis information', 'PRESCRIPTION_MISSING_DIAGNOSIS', 400);
      }

      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByDoctorId(doctorId: string): Promise<Prescription[]> {
    try {
      const docs = await this.prescriptionModel.find({ doctorId })
        .populate('doctorId', 'name email')
        .populate('patientId', 'name email')
        .populate('appointmentId', 'appointmentDate')
        .sort({ createdAt: -1 })
        .lean();

      return docs.map((doc: any) => {
        // Ensure populated fields are properly handled
        // If population fails, use the original ObjectId
        if (doc.doctorId && typeof doc.doctorId === 'object' && doc.doctorId._id) {
          doc.doctorId = doc.doctorId._id;
        } else if (doc.doctorId && typeof doc.doctorId === 'object' && doc.doctorId.$oid) {
          doc.doctorId = doc.doctorId.$oid;
        }
 
        if (doc.patientId && typeof doc.patientId === 'object' && doc.patientId._id) {
          doc.patientId = doc.patientId._id;
        } else if (doc.patientId && typeof doc.patientId === 'object' && doc.patientId.$oid) {
          doc.patientId = doc.patientId.$oid;
        }
 
        if (doc.appointmentId && typeof doc.appointmentId === 'object' && doc.appointmentId._id) {
          doc.appointmentId = doc.appointmentId._id;
        } else if (doc.appointmentId && typeof doc.appointmentId === 'object' && doc.appointmentId.$oid) {
          doc.appointmentId = doc.appointmentId.$oid;
        }
        return Prescription.fromMongoDocument(doc);
      });
    } catch (error) {
      console.error('Database error (findByDoctorId prescription):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByPatientId(patientId: string): Promise<Prescription[]> {
    try {
      const docs = await this.prescriptionModel.find({ patientId })
        .populate('doctorId', 'name email')
        .populate('patientId', 'name email')
        .populate('appointmentId', 'appointmentDate')
        .sort({ createdAt: -1 })
        .lean();

      return docs.map((doc: any) => {
        // Ensure populated fields are properly handled
        if (doc.doctorId && typeof doc.doctorId === 'object' && doc.doctorId._id) {
          doc.doctorId = doc.doctorId._id;
        } else if (doc.doctorId && typeof doc.doctorId === 'object' && doc.doctorId.$oid) {
          doc.doctorId = doc.doctorId.$oid;
        }

        if (doc.patientId && typeof doc.patientId === 'object' && doc.patientId._id) {
          doc.patientId = doc.patientId._id;
        } else if (doc.patientId && typeof doc.patientId === 'object' && doc.patientId.$oid) {
          doc.patientId = doc.patientId.$oid;
        }

        if (doc.appointmentId && typeof doc.appointmentId === 'object' && doc.appointmentId._id) {
          doc.appointmentId = doc.appointmentId._id;
        } else if (doc.appointmentId && typeof doc.appointmentId === 'object' && doc.appointmentId.$oid) {
          doc.appointmentId = doc.appointmentId.$oid;
        }

        return Prescription.fromMongoDocument(doc);
      });
    } catch (error) {
      console.error('Database error (findByPatientId prescription):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByAppointmentId(appointmentId: string): Promise<Prescription | null> {
    try {
      const doc = await this.prescriptionModel.findOne({ appointmentId })
        .populate('doctorId', 'name email')
        .populate('patientId', 'name email')
        .populate('appointmentId', 'appointmentDate')
        .lean();

      if (!doc) return null;

      // Ensure populated fields are properly handled
      if (doc.doctorId && typeof doc.doctorId === 'object' && doc.doctorId._id) {
        doc.doctorId = doc.doctorId._id;
      }
      if (doc.patientId && typeof doc.patientId === 'object' && doc.patientId._id) {
        doc.patientId = doc.patientId._id;
      }
      if (doc.appointmentId && typeof doc.appointmentId === 'object' && doc.appointmentId._id) {
        doc.appointmentId = doc.appointmentId._id;
      }

      return Prescription.fromMongoDocument(doc);
    } catch (error: any) {
      console.error('Database error (findByAppointmentId prescription):', error);

      // Handle specific prescription data errors
      if (error.message === 'PRESCRIPTION_NOT_FOUND') {
        return null;
      }

      if (error.message === 'PRESCRIPTION_INVALID_ID') {
        throw new AppError('Invalid prescription ID', 'PRESCRIPTION_INVALID_ID', 400);
      }

      if (error.message === 'PRESCRIPTION_MISSING_APPOINTMENT') {
        throw new AppError('Prescription is missing appointment information', 'PRESCRIPTION_MISSING_APPOINTMENT', 400);
      }

      if (error.message === 'PRESCRIPTION_MISSING_DOCTOR') {
        throw new AppError('Prescription is missing doctor information', 'PRESCRIPTION_MISSING_DOCTOR', 400);
      }

      if (error.message === 'PRESCRIPTION_MISSING_PATIENT') {
        throw new AppError('Prescription is missing patient information', 'PRESCRIPTION_MISSING_PATIENT', 400);
      }

      if (error.message === 'PRESCRIPTION_MISSING_DIAGNOSIS') {
        throw new AppError('Prescription is missing diagnosis information', 'PRESCRIPTION_MISSING_DIAGNOSIS', 400);
      }

      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async updateStatus(id: string, status: 'Created' | 'Dispensed' | 'Cancelled'): Promise<Prescription | null> {
    try {
      const doc = await this.prescriptionModel.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      )
        .populate('doctorId', 'name email')
        .populate('patientId', 'name email')
        .populate('appointmentId', 'appointmentDate')
        .lean();

      if (!doc) return null;

      // Ensure populated fields are properly handled
      if (doc.doctorId && typeof doc.doctorId === 'object' && doc.doctorId._id) {
        doc.doctorId = doc.doctorId._id;
      }
      if (doc.patientId && typeof doc.patientId === 'object' && doc.patientId._id) {
        doc.patientId = doc.patientId._id;
      }
      if (doc.appointmentId && typeof doc.appointmentId === 'object' && doc.appointmentId._id) {
        doc.appointmentId = doc.appointmentId._id;
      }

      return Prescription.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (updateStatus prescription):', error);
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
