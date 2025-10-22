import { AppError } from '@/shared/errors/app-error';
import { UpdateLabTestCategoryRequest, UpdateLabTestCategoryResponse } from '@/domain/types/labTestAdmin/lab-test-category.type';
// TODO: Import ILabTestCategoryRepository once repository interface is created
// import { ILabTestCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTestCategory-repository.interface';
import { IUpdateLabTestCategoryUseCase } from '../interfaces/labTestAdmin/update-lab-test-category.use-case.interface';

// Temporary interface until repository is created
interface ILabTestCategoryRepository {
    findById(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
}

export class UpdateLabTestCategoryUseCase implements IUpdateLabTestCategoryUseCase {
    constructor(
        private readonly labTestCategoryRepository: ILabTestCategoryRepository
    ) { }

    async execute(categoryId: string, request: UpdateLabTestCategoryRequest): Promise<UpdateLabTestCategoryResponse> {
        if (!categoryId) {
            throw new AppError('Category ID is required', 'VALIDATION_001', 400);
        }

        // Check if category exists
        const existingCategory = await this.labTestCategoryRepository.findById(categoryId);
        if (!existingCategory) {
            throw new AppError('Lab test category not found', 'NOT_FOUND', 404);
        }

        // Validate request
        this.validateRequest(request);

        // Prepare update data
        const updateData: any = {
            ...request,
            updatedAt: new Date()
        };

        // Update category
        const updatedCategory = await this.labTestCategoryRepository.update(categoryId, updateData);

        return {
            success: true,
            message: 'Lab test category updated successfully',
            timestamp: new Date().toISOString(),
            data: {
                categoryId: updatedCategory.id,
                name: updatedCategory.name,
                description: updatedCategory.description,
                status: updatedCategory.status,
                updatedAt: updatedCategory.updatedAt.toISOString()
            }
        };
    }

    private validateRequest(request: UpdateLabTestCategoryRequest): void {
        if (request.status && !['active', 'inactive'].includes(request.status)) {
            throw new AppError('Status must be either active or inactive', 'VALIDATION_002', 400);
        }
    }
}