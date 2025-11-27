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
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<{ categories: PharmacyCategory[]; total: number }>;
  findById(id: string): Promise<PharmacyCategory | null>;
  update(id: string, categoryData: any): Promise<PharmacyCategory>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}