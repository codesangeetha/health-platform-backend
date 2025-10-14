import { LabTestCategory } from '@/domain/entities/labTestCategory.entity';

export interface ILabTestCategoryRepository {
  create(category: any): Promise<LabTestCategory>;
  findAll(options: {
    skip?: number;
    limit?: number;
    status?: 'active' | 'inactive';
    name?: string;
  }): Promise<LabTestCategory[]>;
  findById(id: string): Promise<LabTestCategory | null>;
  update(id: string, category: any): Promise<LabTestCategory>;
  delete(id: string): Promise<void>;
  count(filter: any): Promise<number>;
}