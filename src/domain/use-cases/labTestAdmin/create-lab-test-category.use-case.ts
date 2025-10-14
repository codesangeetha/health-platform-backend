import { AppError } from '@/shared/errors/app-error';
import { CreateLabTestCategoryRequest, CreateLabTestCategoryResponse } from '@/domain/types/labTestAdmin/lab-test-category.type';
// TODO: Import ILabTestCategoryRepository once repository interface is created
// import { ILabTestCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTestCategory-repository.interface';
import { ICreateLabTestCategoryUseCase } from '../interfaces/labTestAdmin/create-lab-test-category.use-case.interface';

// Temporary interface until repository is created
interface ILabTestCategoryRepository {
    create(data: any): Promise<any>;
}

export class CreateLabTestCategoryUseCase implements ICreateLabTestCategoryUseCase {
    constructor(
        private readonly labTestCategoryRepository: ILabTestCategoryRepository
    ) { }

    async execute(request: CreateLabTestCategoryRequest): Promise<CreateLabTestCategoryResponse> {
        // Validate input
        this.validateRequest(request);

        const categoryData = {
            name: request.name,
            description: request.description,
            status: request.status
        };

        const category = await this.labTestCategoryRepository.create(categoryData);

        return {
            success: true,
            message: 'Lab test category created successfully',
            timestamp: new Date().toISOString(),
            data: {
                categoryId: category.id,
                name: category.name,
                description: category.description,
                status: category.status,
                createdAt: category.createdAt.toISOString()
            }
        };
    }

    private validateRequest(request: CreateLabTestCategoryRequest): void {
        const requiredFields = ['name', 'status'];
        for (const field of requiredFields) {
            if (!request[field as keyof typeof request]) {
                throw new AppError(`Missing required field: ${field}`, 'VALIDATION_001', 400);
            }
        }

        if (request.status && !['active', 'inactive'].includes(request.status)) {
            throw new AppError('Status must be either active or inactive', 'VALIDATION_002', 400);
        }
    }
}