import { AppError } from '@/shared/errors/app-error';
import { PharmacyCategory } from '@/domain/entities/pharmacyCategory.entity';
import {IPharmacyCategoryRepository} from './pharmacyCategory-repository.interface';


export class PharmacyCategoryRepositoryMongoDB implements IPharmacyCategoryRepository {
  constructor(private readonly categoryModel: any) {}

  async create(category: any): Promise<PharmacyCategory> {
    try {
      
      // Save into MongoDB
      const doc = await this.categoryModel.create(category);

      // Convert back to entity
      return PharmacyCategory.fromMongoDocument(doc.toObject());
    } catch (error) {
      console.error("Database error (create category):", error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters?: {
      status?: 'active' | 'inactive';
      name?: string;
      description?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<{ categories: PharmacyCategory[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build filter conditions dynamically
      const filter: any = {};
      if (filters?.status) filter.status = filters.status;
      if (filters?.name) filter.name = { $regex: filters.name, $options: 'i' }; // case-insensitive search
      if (filters?.description) filter.description = { $regex: filters.description, $options: 'i' }; // case-insensitive search
      
      // Handle date range filtering
      if (filters?.fromDate || filters?.toDate) {
        filter.createdAt = {};
        if (filters.fromDate) {
          filter.createdAt.$gte = new Date(filters.fromDate);
        }
        if (filters.toDate) {
          // Add 1 day to include the entire end date
          const endDate = new Date(filters.toDate);
          endDate.setDate(endDate.getDate() + 1);
          filter.createdAt.$lt = endDate;
        }
      }

      // Fetch data & count total
      const [docs, total] = await Promise.all([
        this.categoryModel.find(filter).skip(skip).limit(limit).lean(),
        this.categoryModel.countDocuments(filter)
      ]);

      // Convert documents to entities
      const categories = docs.map((doc: any) =>
        PharmacyCategory.fromMongoDocument(doc)
      );

      return { categories, total };
    } catch (error) {
      console.error('Database error (findAll categories):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findById(id: string): Promise<PharmacyCategory | null> {
    try {
      const doc = await this.categoryModel.findById(id).lean();
      return doc ? PharmacyCategory.fromMongoDocument(doc) : null;
    } catch (error) {
      console.error('Database error (findById category):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async update(id: string, categoryData: any): Promise<PharmacyCategory> {
    try {
      const doc = await this.categoryModel.findByIdAndUpdate(
        id,
        { ...categoryData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();

      if (!doc) {
        throw new AppError('Category not found', 'CATEGORY_NOT_FOUND', 404);
      }

      return PharmacyCategory.fromMongoDocument(doc);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Database error (update category):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.categoryModel.findByIdAndDelete(id);
      if (!result) {
        throw new AppError('Category not found', 'CATEGORY_NOT_FOUND', 404);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Database error (delete category):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async count(): Promise<number> {
    try {
      return await this.categoryModel.countDocuments();
    } catch (error) {
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }
}