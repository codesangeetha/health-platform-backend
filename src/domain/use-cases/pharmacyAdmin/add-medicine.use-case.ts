import { AppError } from '@/shared/errors/app-error';
import { AddPharmacyCategoryRequest, AddPharmacyCategoryResponse } from '@/domain/types/pharmacyAdmin/add-medicine-category.type';
import { PharmacyMedicineRequest, PharmacyMedicineResponse } from '@/domain/types/pharmacyAdmin/add-medicine.type';
import { IMedicineRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository.interface';
import { IAddMedicineUseCase } from '../interfaces/pharmacyAdmin/add-medicine.use-case.interface';


export class AddMedicineUsecase implements IAddMedicineUseCase {
    constructor(
        private readonly medicineRepository: IMedicineRepository
    ) { }

    async execute(request: PharmacyMedicineRequest): Promise<PharmacyMedicineResponse> {
        // Validate input
        this.validateRegistrationRequest(request);

        const medicines = await this.medicineRepository.create(request);

        return {
            success: true,
            message: 'Medicine added successfully',
            timestamp: new Date().toISOString(),
            data: {
                medicineId: medicines.id,
                name: medicines.name,
                category: medicines.category,
                price: medicines.price,
                stock: medicines.stock,
                status: medicines.status,
                createdAt: medicines.createdAt.toISOString()
            }
        };
    }

    private validateRegistrationRequest(request: AddPharmacyCategoryRequest): void {
        const commonFields = ['name', 'genericName', 'category', 'manufacturer', 'price', 'stock', 'description', 'dosage', 'sideEffects', 'interactions', 'ingredients', 'storage', 'expiryDate', 'status',];
        for (const field of commonFields) {
            if (!request[field as keyof typeof request]) {
                throw new AppError(`Missing required field: ${field}`, 'USER_001', 400);
            }
        }

    }
}