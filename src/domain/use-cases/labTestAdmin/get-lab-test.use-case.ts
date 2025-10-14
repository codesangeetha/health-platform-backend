import { AppError } from '@/shared/errors/app-error';
import { GetLabTestByIdResponse } from '@/domain/types/labTestAdmin/lab-test.type';
// TODO: Import ILabTestRepository once repository interface is created
// import { ILabTestRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTest-repository.interface';
import { IGetLabTestUseCase } from '../interfaces/labTestAdmin/get-lab-test.use-case.interface';

// Temporary interface until repository is created
interface ILabTestRepository {
    findById(id: string): Promise<any>;
}

export class GetLabTestUseCase implements IGetLabTestUseCase {
    constructor(
        private readonly labTestRepository: ILabTestRepository
    ) { }

    async execute(testId: string): Promise<GetLabTestByIdResponse> {
        if (!testId) {
            throw new AppError('Test ID is required', 'VALIDATION_001', 400);
        }

        const test = await this.labTestRepository.findById(testId);

        if (!test) {
            throw new AppError('Lab test not found', 'NOT_FOUND', 404);
        }

        return {
            success: true,
            message: 'Lab test retrieved successfully',
            timestamp: new Date().toISOString(),
            data: {
                testId: test.id,
                name: test.name,
                categoryId: test.categoryId,
                price: test.price,
                description: test.description,
                isActive: test.isActive,
                createdAt: test.createdAt.toISOString(),
                updatedAt: test.updatedAt.toISOString()
            }
        };
    }
}