import { AppError } from '@/shared/errors/app-error';
import { DeleteLabTestResponse } from '@/domain/types/labTestAdmin/lab-test.type';
// TODO: Import ILabTestRepository once repository interface is created
// import { ILabTestRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTest-repository.interface';
import { IDeleteLabTestUseCase } from '../interfaces/labTestAdmin/delete-lab-test.use-case.interface';

// Temporary interface until repository is created
interface ILabTestRepository {
    findById(id: string): Promise<any>;
    delete(id: string): Promise<any>;
}

export class DeleteLabTestUseCase implements IDeleteLabTestUseCase {
    constructor(
        private readonly labTestRepository: ILabTestRepository
    ) { }

    async execute(testId: string): Promise<DeleteLabTestResponse> {
        if (!testId) {
            throw new AppError('Test ID is required', 'VALIDATION_001', 400);
        }

        // Check if test exists
        const existingTest = await this.labTestRepository.findById(testId);
        if (!existingTest) {
            throw new AppError('Lab test not found', 'NOT_FOUND', 404);
        }

        // Delete test
        await this.labTestRepository.delete(testId);

        return {
            success: true,
            message: 'Lab test deleted successfully',
            timestamp: new Date().toISOString(),
            data: {
                testId,
                deletedAt: new Date().toISOString()
            }
        };
    }
}