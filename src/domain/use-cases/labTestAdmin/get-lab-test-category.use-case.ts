import { AppError } from '@/shared/errors/app-error';
import { GetLabTestCategoryByIdResponse } from '@/domain/types/labTestAdmin/lab-test-category.type';
// TODO: Import ILabTestCategoryRepository once repository interface is created
// import { ILabTestCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTestCategory-repository.interface';
import { IGetLabTestCategoryUseCase } from '../interfaces/labTestAdmin/get-lab-test-category.use-case.interface';

// Temporary interface until repository is created
interface ILabTestCategoryRepository {
    findById(id: string): Promise<any>;
}

export class GetLabTestCategoryUseCase implements IGetLabTestCategoryUseCase {
    constructor(
        private readonly labTestCategoryRepository: ILabTestCategoryRepository
    ) { }

    async execute(categoryId: string): Promise<GetLabTestCategoryByIdResponse> {
        if (!categoryId) {
            throw new AppError('Category ID is required', 'VALIDATION_001', 400);
        }

        const category = await this.labTestCategoryRepository.findById(categoryId);

        if (!category) {
            throw new AppError('Lab test category not found', 'NOT_FOUND', 404);
        }

        return {
            success: true,
            message: 'Lab test category retrieved successfully',
            timestamp: new Date().toISOString(),
            data: {
                categoryId: category.id,
                name: category.name,
                description: category.description,
                status: category.status,
                createdAt: category.createdAt.toISOString(),
                updatedAt: category.updatedAt.toISOString()
            }
        };
    }
}