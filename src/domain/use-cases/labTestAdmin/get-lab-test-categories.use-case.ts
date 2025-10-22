import { AppError } from '@/shared/errors/app-error';
import { GetLabTestCategoriesRequest, GetLabTestCategoriesResponse } from '@/domain/types/labTestAdmin/lab-test-category.type';
// TODO: Import ILabTestCategoryRepository once repository interface is created
// import { ILabTestCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTestCategory-repository.interface';
import { IGetLabTestCategoriesUseCase } from '../interfaces/labTestAdmin/get-lab-test-categories.use-case.interface';

// Temporary interface until repository is created
interface ILabTestCategoryRepository {
    findAll(options: any): Promise<any[]>;
    count(options: any): Promise<number>;
}

export class GetLabTestCategoriesUseCase implements IGetLabTestCategoriesUseCase {
    constructor(
        private readonly labTestCategoryRepository: ILabTestCategoryRepository
    ) { }

    async execute(request: GetLabTestCategoriesRequest): Promise<GetLabTestCategoriesResponse> {
        const { page = 1, limit = 10, status, search } = request;

        // Build filter options
        const filterOptions: any = {};
        if (status) {
            filterOptions.status = status;
        }
        if (search) {
            filterOptions.name = { $regex: search, $options: 'i' };
        }

        // Build pagination options
        const paginationOptions = {
            skip: (page - 1) * limit,
            limit
        };

        // Get categories and count
        const [categories, totalCount] = await Promise.all([
            this.labTestCategoryRepository.findAll({ ...filterOptions, ...paginationOptions }),
            this.labTestCategoryRepository.count(filterOptions)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            success: true,
            message: 'Lab test categories retrieved successfully',
            timestamp: new Date().toISOString(),
            data: {
                categories: categories.map(category => ({
                    categoryId: category.id,
                    name: category.name,
                    description: category.description,
                    status: category.status,
                    createdAt: category.createdAt.toISOString(),
                    updatedAt: category.updatedAt.toISOString()
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