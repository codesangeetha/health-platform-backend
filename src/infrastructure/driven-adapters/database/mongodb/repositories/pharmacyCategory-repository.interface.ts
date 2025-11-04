import { PharmacyCategory } from '@/domain/entities/pharmacyCategory.entity';

export interface IPharmacyCategoryRepository {
  create(category: any): Promise<PharmacyCategory>;
  findAll(
    page: number,
    limit: number,
    filters?: {
      status?: 'active' | 'inactive';
      name?: string;
      description?: string;
      createdAt?: string;
    }
  ): Promise<{ categories: PharmacyCategory[]; total: number }>;
  count(): Promise<number>;
}