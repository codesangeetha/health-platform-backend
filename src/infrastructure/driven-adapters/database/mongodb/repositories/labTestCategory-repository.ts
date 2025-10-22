import { Model } from 'mongoose';
import { LabTestCategory } from '@/domain/entities/labTestCategory.entity';
import { ILabTestCategoryRepository } from './labTestCategory-repository.interface';
import { LabTestCategoryModel } from '../schemas/labTestCategory.schema';
import { AppError } from '@/shared/errors/app-error';

export class LabTestCategoryRepository implements ILabTestCategoryRepository {
  constructor(private readonly labTestCategoryModel: Model<any> = LabTestCategoryModel) {}

  async create(categoryData: any): Promise<LabTestCategory> {
    try {
      const category = new this.labTestCategoryModel(categoryData);
      const savedCategory = await category.save();

      return LabTestCategory.fromMongoDocument(savedCategory.toObject());
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Lab test category with this name already exists', 'DUPLICATE_ERROR', 409);
      }
      throw new AppError('Failed to create lab test category', 'DATABASE_ERROR', 500);
    }
  }

  async findAll(options: {
    skip?: number;
    limit?: number;
    status?: 'active' | 'inactive';
    name?: string;
  }): Promise<LabTestCategory[]> {
    try {
      const { skip = 0, limit = 10, status, name } = options;
      const filter: any = {};

      if (status) {
        filter.status = status;
      }

      if (name) {
        filter.name = { $regex: name, $options: 'i' };
      }

      const categories = await this.labTestCategoryModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return categories.map(category => LabTestCategory.fromMongoDocument(category));
    } catch (error: any) {
      throw new AppError('Failed to fetch lab test categories', 'DATABASE_ERROR', 500);
    }
  }

  async findById(id: string): Promise<LabTestCategory | null> {
    try {
      const category = await this.labTestCategoryModel.findById(id).lean();

      if (!category) {
        return null;
      }

      return LabTestCategory.fromMongoDocument(category);
    } catch (error: any) {
      throw new AppError('Failed to fetch lab test category', 'DATABASE_ERROR', 500);
    }
  }

  async update(id: string, categoryData: any): Promise<LabTestCategory> {
    try {
      const updatedCategory = await this.labTestCategoryModel
        .findByIdAndUpdate(
          id,
          { ...categoryData, updatedAt: new Date() },
          { new: true, runValidators: true }
        )
        .lean();

      if (!updatedCategory) {
        throw new AppError('Lab test category not found', 'NOT_FOUND', 404);
      }

      return LabTestCategory.fromMongoDocument(updatedCategory);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Lab test category with this name already exists', 'DUPLICATE_ERROR', 409);
      }
      if (error.message?.includes('not found')) {
        throw error;
      }
      throw new AppError('Failed to update lab test category', 'DATABASE_ERROR', 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deletedCategory = await this.labTestCategoryModel.findByIdAndDelete(id);

      if (!deletedCategory) {
        throw new AppError('Lab test category not found', 'NOT_FOUND', 404);
      }
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        throw error;
      }
      throw new AppError('Failed to delete lab test category', 'DATABASE_ERROR', 500);
    }
  }

  async count(filter: any = {}): Promise<number> {
    try {
      return await this.labTestCategoryModel.countDocuments(filter);
    } catch (error: any) {
      throw new AppError('Failed to count lab test categories', 'DATABASE_ERROR', 500);
    }
  }
}