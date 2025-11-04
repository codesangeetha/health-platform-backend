import { Model } from 'mongoose';
import { LabTest } from '@/domain/entities/labTest.entity';
import { ILabTestRepository } from './labTest-repository.interface';
import { LabTestModel } from '../schemas/labTest.schema';
import { AppError } from '@/shared/errors/app-error';

export class LabTestRepository implements ILabTestRepository {
  constructor(private readonly labTestModel: Model<any> = LabTestModel) {}

  async create(labTestData: any): Promise<LabTest> {
    try {
      const labTest = new this.labTestModel(labTestData);
      const savedLabTest = await labTest.save();

      return LabTest.fromMongoDocument(savedLabTest.toObject());
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Lab test with this name already exists in this category', 'DUPLICATE_ERROR', 409);
      }
      throw new AppError('Failed to create lab test', 'DATABASE_ERROR', 500);
    }
  }

  async findAll(options: {
    skip?: number;
    limit?: number;
    categoryId?: string;
    isActive?: boolean;
    name?: string;
    description?: string;
    price?: any;
    createdAt?: any;
    sort?: any;
    $or?: any[];
  }): Promise<LabTest[]> {
    try {
      const {
        skip = 0,
        limit = 10,
        categoryId,
        isActive,
        name,
        description,
        price,
        createdAt,
        sort,
        $or
      } = options;
      const filter: any = {};

      if (categoryId) {
        filter.categoryId = categoryId;
      }

      if (typeof isActive === 'boolean') {
        filter.isActive = isActive;
      }

      if (name) {
        filter.name = { $regex: name, $options: 'i' };
      }

      if (description) {
        filter.description = { $regex: description, $options: 'i' };
      }

      if (price) {
        filter.price = price;
      }

      if (createdAt) {
        filter.createdAt = createdAt;
      }

      if ($or) {
        filter.$or = $or;
      }

      const labTests = await this.labTestModel
        .find(filter)
        .populate('categoryId')
        .sort(sort || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return labTests.map(labTest => LabTest.fromMongoDocument(labTest));
    } catch (error: any) {
      throw new AppError('Failed to fetch lab tests', 'DATABASE_ERROR', 500);
    }
  }

  async findById(id: string): Promise<LabTest | null> {
    try {
      const labTest = await this.labTestModel
        .findById(id)
        .populate('categoryId')
        .lean();

      if (!labTest) {
        return null;
      }

      return LabTest.fromMongoDocument(labTest);
    } catch (error: any) {
      throw new AppError('Failed to fetch lab test', 'DATABASE_ERROR', 500);
    }
  }

  async update(id: string, labTestData: any): Promise<LabTest> {
    try {
      const updatedLabTest = await this.labTestModel
        .findByIdAndUpdate(
          id,
          { ...labTestData, updatedAt: new Date() },
          { new: true, runValidators: true }
        )
        .populate('categoryId')
        .lean();

      if (!updatedLabTest) {
        throw new AppError('Lab test not found', 'NOT_FOUND', 404);
      }

      return LabTest.fromMongoDocument(updatedLabTest);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError('Lab test with this name already exists in this category', 'DUPLICATE_ERROR', 409);
      }
      if (error.message?.includes('not found')) {
        throw error;
      }
      throw new AppError('Failed to update lab test', 'DATABASE_ERROR', 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deletedLabTest = await this.labTestModel.findByIdAndDelete(id);

      if (!deletedLabTest) {
        throw new AppError('Lab test not found', 'NOT_FOUND', 404);
      }
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        throw error;
      }
      throw new AppError('Failed to delete lab test', 'DATABASE_ERROR', 500);
    }
  }

  async count(filter: any = {}): Promise<number> {
    try {
      return await this.labTestModel.countDocuments(filter);
    } catch (error: any) {
      throw new AppError('Failed to count lab tests', 'DATABASE_ERROR', 500);
    }
  }

  async findByCategoryId(categoryId: string): Promise<LabTest[]> {
    try {
      const labTests = await this.labTestModel
        .find({ categoryId, isActive: true })
        .populate('categoryId')
        .sort({ name: 1 })
        .lean();

      return labTests.map(labTest => LabTest.fromMongoDocument(labTest));
    } catch (error: any) {
      throw new AppError('Failed to fetch lab tests by category', 'DATABASE_ERROR', 500);
    }
  }
}