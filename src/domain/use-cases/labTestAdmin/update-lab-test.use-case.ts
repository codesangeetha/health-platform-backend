import { AppError } from '@/shared/errors/app-error';
import { UpdateLabTestRequest, UpdateLabTestResponse } from '@/domain/types/labTestAdmin/lab-test.type';
// TODO: Import repositories once repository interfaces are created
// import { ILabTestRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTest-repository.interface';
// import { ILabTestCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTestCategory-repository.interface';
import { IUpdateLabTestUseCase } from '../interfaces/labTestAdmin/update-lab-test.use-case.interface';

// Temporary interfaces until repositories are created
interface ILabTestRepository {
    findById(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
}

interface ILabTestCategoryRepository {
    findById(id: string): Promise<any>;
}

export class UpdateLabTestUseCase implements IUpdateLabTestUseCase {
    constructor(
        private readonly labTestRepository: ILabTestRepository,
        private readonly labTestCategoryRepository: ILabTestCategoryRepository
    ) { }

    async execute(testId: string, request: UpdateLabTestRequest): Promise<UpdateLabTestResponse> {
        if (!testId) {
            throw new AppError('Test ID is required', 'VALIDATION_001', 400);
        }

        // Check if test exists
        const existingTest = await this.labTestRepository.findById(testId);
        if (!existingTest) {
            throw new AppError('Lab test not found', 'NOT_FOUND', 404);
        }

        // Validate request
        this.validateRequest(request);

        // If categoryId is being updated, check if the new category exists
        if (request.categoryId && request.categoryId !== existingTest.categoryId) {
            const category = await this.labTestCategoryRepository.findById(request.categoryId);
            if (!category) {
                throw new AppError('Lab test category not found', 'NOT_FOUND', 404);
            }
        }

        // Prepare update data
        const updateData: any = {
            ...request,
            updatedAt: new Date()
        };

        // Update test
        const updatedTest = await this.labTestRepository.update(testId, updateData);

        return {
            success: true,
            message: 'Lab test updated successfully',
            timestamp: new Date().toISOString(),
            data: {
                testId: updatedTest.id,
                name: updatedTest.name,
                categoryId: updatedTest.categoryId,
                price: updatedTest.price,
                description: updatedTest.description,
                isActive: updatedTest.isActive,
                updatedAt: updatedTest.updatedAt.toISOString()
            }
        };
    }

    private validateRequest(request: UpdateLabTestRequest): void {
        if (request.price !== undefined && request.price < 0) {
            throw new AppError('Price must be greater than or equal to 0', 'VALIDATION_002', 400);
        }
    }
}