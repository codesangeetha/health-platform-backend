import { AppError } from '@/shared/errors/app-error';
import { GetLabTestCategoriesRequest, GetLabTestCategoriesResponse } from '@/domain/types/labTestAdmin/lab-test-category.type';
import { ILabTestCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTestCategory-repository.interface';
import { IGetLabTestCategoriesUseCase } from '../interfaces/labTestAdmin/get-lab-test-categories.use-case.interface';

export class GetLabTestCategoriesUseCase implements IGetLabTestCategoriesUseCase {
    constructor(
        private readonly labTestCategoryRepository: ILabTestCategoryRepository
    ) { }

    async execute(request: GetLabTestCategoriesRequest): Promise<GetLabTestCategoriesResponse> {
        const { page = 1, limit = 10, status, name, description, createdAtDate, fromdate, toDate, search } = request;

        // Build filter options
        const filterOptions: any = {};

        // Handle status filter
        if (status) {
            filterOptions.status = status;
        }

        // Handle name filter (supports both direct name and legacy search)
        if (name) {
            filterOptions.name = { $regex: name, $options: 'i' };
        } else if (search) {
            // Legacy support: if search is provided but not name, search in name field
            filterOptions.name = { $regex: search, $options: 'i' };
        }

        // Handle description filter
        if (description) {
            filterOptions.description = { $regex: description, $options: 'i' };
        }

        // Handle date filtering - prioritize date range over single date
        if (fromdate && toDate) {
            // Handle date range filtering (fromdate to toDate)
            const fromDate = new Date(fromdate);
            const toDateObj = new Date(toDate);
            
            if (isNaN(fromDate.getTime()) || isNaN(toDateObj.getTime())) {
                throw new AppError('Invalid date format. Use YYYY-MM-DD for fromdate and toDate', 'INVALID_DATE_FORMAT', 400);
            }
            
            // Set start and end of the day for both dates
            const startOfDay = new Date(fromDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(toDateObj.setHours(23, 59, 59, 999));
            
            filterOptions.createdAt = {
                $gte: startOfDay,
                $lte: endOfDay
            };
        } else if (createdAtDate) {
            // Legacy support: handle single date filtering
            const date = new Date(createdAtDate);
            if (isNaN(date.getTime())) {
                throw new AppError('Invalid createdAtDate format. Use YYYY-MM-DD', 'INVALID_DATE_FORMAT', 400);
            }
            
            // Set start and end of the day for exact date match
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            
            filterOptions.createdAt = {
                $gte: startOfDay,
                $lte: endOfDay
            };
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
                    ...(category.description && { description: category.description }),
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