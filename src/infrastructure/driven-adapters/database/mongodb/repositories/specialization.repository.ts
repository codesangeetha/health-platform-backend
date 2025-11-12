import { Model } from 'mongoose';
import { ISpecializationRepository, Specialization } from './specialization-repository.interface';
import { AppError } from '@/shared/errors/app-error';
import { SpecializationModel } from '../schemas/specialization.schema';

export class SpecializationRepository implements ISpecializationRepository {
  constructor(private readonly specializationModel: Model<any> = SpecializationModel) {}

  private convertToSpecialization(doc: any): Specialization {
    return {
      id: doc._id?.toString(),
      name: doc.name,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  async create(name: string): Promise<Specialization> {
    try {
      const specialization = new this.specializationModel({
        name,
        status: 'active'
      });
      const savedSpecialization = await specialization.save();

      return this.convertToSpecialization(savedSpecialization.toObject());
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Specialization with this name already exists', 'DUPLICATE_ERROR', 409);
      }
      throw new AppError('Failed to create specialization', 'DATABASE_ERROR', 500);
    }
  }

  async findAll(options: {
    skip?: number;
    limit?: number;
    status?: 'active' | 'inactive';
    name?: string;
    createdAt?: {
      gte?: Date;
      lte?: Date;
    };
  }): Promise<Specialization[]> {
    try {
      const { skip = 0, limit = 10, status, name, createdAt } = options;
      const filter: any = {};

      if (status) {
        filter.status = status;
      }

      if (name) {
        filter.name = name;
      }

      if (createdAt) {
        filter.createdAt = {};
        if (createdAt.gte) {
          filter.createdAt.$gte = createdAt.gte;
        }
        if (createdAt.lte) {
          filter.createdAt.$lte = createdAt.lte;
        }
      }

      const specializations = await this.specializationModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

      return specializations.map(doc => this.convertToSpecialization(doc));
    } catch (error: any) {
      throw new AppError('Failed to fetch specializations', 'DATABASE_ERROR', 500);
    }
  }

  async findById(id: string): Promise<Specialization | null> {
    try {
      const specialization = await this.specializationModel.findById(id).lean().exec();

      if (!specialization) {
        return null;
      }

      return this.convertToSpecialization(specialization);
    } catch (error: any) {
      throw new AppError('Failed to fetch specialization', 'DATABASE_ERROR', 500);
    }
  }

  async update(id: string, data: { name: string }): Promise<Specialization> {
    try {
      const updatedSpecialization = await this.specializationModel
        .findByIdAndUpdate(
          id,
          { ...data, updatedAt: new Date() },
          { new: true, runValidators: true }
        )
        .lean()
        .exec();

      if (!updatedSpecialization) {
        throw new AppError('Specialization not found', 'NOT_FOUND', 404);
      }

      return this.convertToSpecialization(updatedSpecialization);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Specialization with this name already exists', 'DUPLICATE_ERROR', 409);
      }
      if (error.message?.includes('not found')) {
        throw error;
      }
      throw new AppError('Failed to update specialization', 'DATABASE_ERROR', 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deletedSpecialization = await this.specializationModel.findByIdAndDelete(id).exec();

      if (!deletedSpecialization) {
        throw new AppError('Specialization not found', 'NOT_FOUND', 404);
      }
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        throw error;
      }
      throw new AppError('Failed to delete specialization', 'DATABASE_ERROR', 500);
    }
  }

  async count(filter: any = {}): Promise<number> {
    try {
      return await this.specializationModel.countDocuments(filter).exec();
    } catch (error: any) {
      throw new AppError('Failed to count specializations', 'DATABASE_ERROR', 500);
    }
  }
}