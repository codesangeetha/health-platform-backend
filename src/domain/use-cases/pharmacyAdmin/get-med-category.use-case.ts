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

        const { categories, total } = await this.pharmacyCategoryRepository.findAll(page, limit, request.status, request.name)

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
