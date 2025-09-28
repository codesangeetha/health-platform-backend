import { Medicine } from '@/domain/entities/medicine.entity';

export interface IMedicineRepository {
    create(medicine: any): Promise<Medicine>;
    findAll(
        page: number,
        limit: number,
        status?: 'active' | 'inactive',
        name?: string,
        category?:string
    ): Promise<{ medicines: Medicine[]; total: number }>;
}