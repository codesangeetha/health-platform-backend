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
    status?: 'active' | 'inactive',
    name?: string
  ): Promise<{ categories: PharmacyCategory[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build filter conditions dynamically
      const filter: any = {};
      if (status) filter.status = status;
      if (name) filter.name = { $regex: name, $options: 'i' }; // case-insensitive search

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
}