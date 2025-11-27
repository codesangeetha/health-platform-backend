import { Medicine } from '@/domain/entities/medicine.entity';

export interface IMedicineRepository {
    create(medicine: any): Promise<Medicine>;
    findAll(
        page: number,
        limit: number,
        status?: 'active' | 'inactive',
        name?: string,
        category?:string,
        genericName?: string,
        fromDate?: string,
        toDate?: string
    ): Promise<{ medicines: Medicine[]; total: number }>;
    searchMedicines(
        page: number,
        limit: number,
        query?: string,
        category?: string,
        name?: string,
        genericName?: string,
        priceMin?: number,
        priceMax?: number,
        stockMin?: number,
        stockMax?: number,
        createdDateFrom?: string,
        createdDateTo?: string,
        sortBy?: 'name' | 'genericName' | 'price' | 'stock' | 'createdAt',
        sortOrder?: 'asc' | 'desc'
    ): Promise<{ medicines: Medicine[]; total: number }>;
    findById(id: string): Promise<Medicine | null>;
    updateInventory(
        id: string,
        updates: {
            stock?: number;
            price?: number;
            status?: 'active' | 'inactive';
        }
    ): Promise<Medicine>;
    update(
        id: string,
        updates: {
            name?: string;
            genericName?: string;
            category?: string;
            manufacturer?: string;
            price?: number;
            description?: string;
            dosage?: string;
            sideEffects?: string[];
            interactions?: string[];
            ingredients?: string[];
            storage?: string;
            status?: 'active' | 'inactive';
        }
    ): Promise<Medicine>;
    delete(id: string): Promise<Medicine>;
    count(): Promise<number>;
}