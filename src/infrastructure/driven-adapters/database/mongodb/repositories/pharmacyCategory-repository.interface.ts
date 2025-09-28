import { PharmacyCategory } from '@/domain/entities/pharmacyCategory.entity';

export interface IPharmacyCategoryRepository {
  create(category: any): Promise<PharmacyCategory>;
  findAll(
    page: number,
    limit: number,
    status?: 'active' | 'inactive',
    name?: string
  ): Promise<{ categories: PharmacyCategory[]; total: number }>;
}