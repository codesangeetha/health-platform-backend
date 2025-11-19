import { LabTest } from '@/domain/entities/labTest.entity';

export interface ILabTestRepository {
  create(labTest: any): Promise<LabTest>;
  findAll(options: {
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
  }): Promise<LabTest[]>;
  findById(id: string): Promise<LabTest | null>;
  update(id: string, labTest: any): Promise<LabTest>;
  delete(id: string): Promise<void>;
  count(filter: any): Promise<number>;
  findByCategoryId(categoryId: string): Promise<LabTest[]>;
}