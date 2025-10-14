import { AppError } from '@/shared/errors/app-error';
import { CreateLabTestRequest, CreateLabTestResponse } from '@/domain/types/labTestAdmin/lab-test.type';
// TODO: Import repositories once repository interfaces are created
// import { ILabTestRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTest-repository.interface';
// import { ILabTestCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTestCategory-repository.interface';
import { ICreateLabTestUseCase } from '../interfaces/labTestAdmin/create-lab-test.use-case.interface';

// Temporary interfaces until repositories are created
interface ILabTestRepository {
    create(data: any): Promise<any>;
}

interface ILabTestCategoryRepository {
    findById(id: string): Promise<any>;
}

export class CreateLabTestUseCase implements ICreateLabTestUseCase {
    constructor(
        private readonly labTestRepository: ILabTestRepository,
        private readonly labTestCategoryRepository: ILabTestCategoryRepository
    ) { }

    async execute(request: CreateLabTestRequest): Promise<CreateLabTestResponse> {
        // Validate input
        this.validateRequest(request);

        // Check if category exists
        const category = await this.labTestCategoryRepository.findById(request.categoryId);
        if (!category) {
            throw new AppError('Lab test category not found', 'NOT_FOUND', 404);
        }

        const testData = {
            name: request.name,
            categoryId: request.categoryId,
            price: request.price,
            description: request.description,
            isActive: request.isActive
        };

        const test = await this.labTestRepository.create(testData);

        return {
            success: true,
            message: 'Lab test created successfully',
            timestamp: new Date().toISOString(),
            data: {
                testId: test.id,
                name: test.name,
                categoryId: test.categoryId,
                price: test.price,
                description: test.description,
                isActive: test.isActive,
                createdAt: test.createdAt.toISOString()
            }
        };
    }

    private validateRequest(request: CreateLabTestRequest): void {
        const requiredFields = ['name', 'categoryId', 'price'];
        for (const field of requiredFields) {
            if (!request[field as keyof typeof request]) {
                throw new AppError(`Missing required field: ${field}`, 'VALIDATION_001', 400);
            }
        }

        if (request.price < 0) {
            throw new AppError('Price must be greater than or equal to 0', 'VALIDATION_002', 400);
        }
    }
}