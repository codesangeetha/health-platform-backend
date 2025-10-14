import { AppError } from '@/shared/errors/app-error';
import { DeleteLabTestCategoryResponse } from '@/domain/types/labTestAdmin/lab-test-category.type';
// TODO: Import ILabTestCategoryRepository once repository interface is created
// import { ILabTestCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTestCategory-repository.interface';
import { IDeleteLabTestCategoryUseCase } from '../interfaces/labTestAdmin/delete-lab-test-category.use-case.interface';

// Temporary interface until repository is created
interface ILabTestCategoryRepository {
    findById(id: string): Promise<any>;
    delete(id: string): Promise<any>;
}

export class DeleteLabTestCategoryUseCase implements IDeleteLabTestCategoryUseCase {
    constructor(
        private readonly labTestCategoryRepository: ILabTestCategoryRepository
    ) { }

    async execute(categoryId: string): Promise<DeleteLabTestCategoryResponse> {
        if (!categoryId) {
            throw new AppError('Category ID is required', 'VALIDATION_001', 400);
        }

        // Check if category exists
        const existingCategory = await this.labTestCategoryRepository.findById(categoryId);
        if (!existingCategory) {
            throw new AppError('Lab test category not found', 'NOT_FOUND', 404);
        }

        // Delete category
        await this.labTestCategoryRepository.delete(categoryId);

        return {
            success: true,
            message: 'Lab test category deleted successfully',
            timestamp: new Date().toISOString(),
            data: {
                categoryId,
                deletedAt: new Date().toISOString()
            }
        };
    }
}