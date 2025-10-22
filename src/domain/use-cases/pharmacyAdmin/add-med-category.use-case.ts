import { AppError } from '@/shared/errors/app-error';
import { AddPharmacyCategoryRequest, AddPharmacyCategoryResponse } from '@/domain/types/pharmacyAdmin/add-medicine-category.type'
import { IPharmacyCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/pharmacyCategory-repository.interface';
import { IAddMedCategoryUseCase } from '../interfaces/pharmacyAdmin/add-med-category.use-case.interface';


export class AddMedCategoryUseCase implements IAddMedCategoryUseCase {
    constructor(
        private readonly pharmacyCategoryRepository: IPharmacyCategoryRepository
    ) { }

    async execute(request: AddPharmacyCategoryRequest): Promise<AddPharmacyCategoryResponse> {
        // Validate input
        this.validateRegistrationRequest(request);

        let medcategory;

        const categoryData = {
            name: request.name,
            description: request.description,
            status: request.status
        };
        medcategory = await this.pharmacyCategoryRepository.create(categoryData);

        return {
            success: true,
            message: 'Category added successfully',
            timestamp: new Date().toISOString(),
            data: {
                categoryId: medcategory.id,
                name: medcategory.name,
                status: medcategory.status,
                createdAt: medcategory.createdAt.toISOString()
            }
        };
    }

    private validateRegistrationRequest(request: AddPharmacyCategoryRequest): void {
        const commonFields = ['name', 'description', 'status'];
        for (const field of commonFields) {
            if (!request[field as keyof typeof request]) {
                throw new AppError(`Missing required field: ${field}`, 'USER_001', 400);
            }
        }

    }
}