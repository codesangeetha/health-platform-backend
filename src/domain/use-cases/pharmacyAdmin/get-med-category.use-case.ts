import { AppError } from '@/shared/errors/app-error';
import { IPharmacyCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/pharmacyCategory-repository.interface';
import { IGetMedCategoryUseCase } from '../interfaces/pharmacyAdmin/get-med-category.use-case.interface';
import { GetPharmacyCategoriesRequest, GetPharmacyCategoriesResponse } from '@/domain/types/pharmacyAdmin/get-med-category.type';


export class GetMedCategoryUseCase implements IGetMedCategoryUseCase {
    constructor(
        private readonly pharmacyCategoryRepository: IPharmacyCategoryRepository
    ) { }

    async execute(request: GetPharmacyCategoriesRequest): Promise<GetPharmacyCategoriesResponse> {

        const page = request.page ?? 1;
        const limit = request.limit ?? 10;

        // Prepare filters object (only include defined values)
        const filters: any = {};
        if (request.status) filters.status = request.status;
        if (request.name) filters.name = request.name;
        if (request.description) filters.description = request.description;
        if (request.fromDate) filters.fromDate = request.fromDate;
        if (request.toDate) filters.toDate = request.toDate;

        const { categories, total } = await this.pharmacyCategoryRepository.findAll(page, limit, filters)

        if (!categories || categories.length === 0) {
            throw new AppError('Categories not found', 'CATEGORIES_NOT_FOUND', 404);
        }

        const totalPages = Math.ceil(total / limit);

        return {
            success: true,
            message: 'Medicine categories retrieved successfully',
            data: {

                categories,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages
                }
            },
            timestamp: new Date().toISOString()
        };
    }

}
