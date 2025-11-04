import { AppError } from '@/shared/errors/app-error';
import { GetLabTestsRequest, GetLabTestsResponse } from '@/domain/types/labTestAdmin/lab-test.type';
import { ILabTestRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTest-repository.interface';
import { IGetLabTestsUseCase } from '../interfaces/labTestAdmin/get-lab-tests.use-case.interface';
import { LabTest } from '@/domain/entities/labTest.entity';

export class GetLabTestsUseCase implements IGetLabTestsUseCase {
    constructor(
        private readonly labTestRepository: ILabTestRepository
    ) { }

    async execute(request: GetLabTestsRequest): Promise<GetLabTestsResponse> {
        const {
            page = 1,
            limit = 10,
            categoryId,
            isActive,
            search,
            name,
            description,
            status,
            minPrice,
            maxPrice,
            createdFrom,
            createdTo,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = request;

        // Build filter options
        const filterOptions: any = {};
        if (categoryId) {
            filterOptions.categoryId = categoryId;
        }
        if (typeof isActive === 'boolean') {
            filterOptions.isActive = isActive;
        }
        if (status) {
            filterOptions.isActive = status === 'active';
        }
        if (name) {
            filterOptions.name = { $regex: name, $options: 'i' };
        }
        if (description) {
            filterOptions.description = { $regex: description, $options: 'i' };
        }
        if (minPrice !== undefined) {
            filterOptions.price = { ...filterOptions.price, $gte: minPrice };
        }
        if (maxPrice !== undefined) {
            filterOptions.price = { ...filterOptions.price, $lte: maxPrice };
        }
        if (createdFrom) {
            filterOptions.createdAt = { ...filterOptions.createdAt, $gte: new Date(createdFrom) };
        }
        if (createdTo) {
            filterOptions.createdAt = { ...filterOptions.createdAt, $lte: new Date(createdTo) };
        }
        if (search) {
            filterOptions.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
            delete filterOptions.name;
            delete filterOptions.description;
        }

        // Build sort options
        const sortOptions: any = {};
        if (sortBy) {
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        // Build pagination options
        const paginationOptions = {
            skip: (page - 1) * limit,
            limit,
            sort: sortOptions
        };

        // Get tests and count
        const [tests, totalCount] = await Promise.all([
            this.labTestRepository.findAll({
                ...filterOptions,
                skip: paginationOptions.skip,
                limit: paginationOptions.limit,
                sort: paginationOptions.sort
            }),
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
                    ...(test.description && { description: test.description }),
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