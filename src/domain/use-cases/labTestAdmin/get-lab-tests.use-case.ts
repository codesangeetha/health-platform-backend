import { AppError } from '@/shared/errors/app-error';
import { GetLabTestsRequest, GetLabTestsResponse } from '@/domain/types/labTestAdmin/lab-test.type';
// TODO: Import repositories once repository interfaces are created
// import { ILabTestRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTest-repository.interface';
import { IGetLabTestsUseCase } from '../interfaces/labTestAdmin/get-lab-tests.use-case.interface';

// Temporary interfaces until repositories are created
interface ILabTestRepository {
    findAll(options: any): Promise<any[]>;
    count(options: any): Promise<number>;
}

export class GetLabTestsUseCase implements IGetLabTestsUseCase {
    constructor(
        private readonly labTestRepository: ILabTestRepository
    ) { }

    async execute(request: GetLabTestsRequest): Promise<GetLabTestsResponse> {
        const { page = 1, limit = 10, categoryId, isActive, search } = request;

        // Build filter options
        const filterOptions: any = {};
        if (categoryId) {
            filterOptions.categoryId = categoryId;
        }
        if (typeof isActive === 'boolean') {
            filterOptions.isActive = isActive;
        }
        if (search) {
            filterOptions.name = { $regex: search, $options: 'i' };
        }

        // Build pagination options
        const paginationOptions = {
            skip: (page - 1) * limit,
            limit
        };

        // Get tests and count
        const [tests, totalCount] = await Promise.all([
            this.labTestRepository.findAll({ ...filterOptions, ...paginationOptions }),
            this.labTestRepository.count(filterOptions)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            success: true,
            message: 'Lab tests retrieved successfully',
            timestamp: new Date().toISOString(),
            data: {
                tests: tests.map(test => ({
                    testId: test.id,
                    name: test.name,
                    categoryId: test.categoryId,
                    price: test.price,
                    description: test.description,
                    isActive: test.isActive,
                    createdAt: test.createdAt.toISOString(),
                    updatedAt: test.updatedAt.toISOString()
                })),
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                }
            }
        };
    }
}