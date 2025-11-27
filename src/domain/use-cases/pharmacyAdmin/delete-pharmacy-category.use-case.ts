import { AppError } from '@/shared/errors/app-error';
import { DeletePharmacyCategoryRequest, DeletePharmacyCategoryResponse } from '@/domain/types/pharmacyAdmin/delete-pharmacy-category.type';
import { IPharmacyCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/pharmacyCategory-repository.interface';
import { IDeletePharmacyCategoryUseCase } from '../interfaces/pharmacyAdmin/delete-pharmacy-category.use-case.interface';

export class DeletePharmacyCategoryUseCase implements IDeletePharmacyCategoryUseCase {
    constructor(
        private readonly pharmacyCategoryRepository: IPharmacyCategoryRepository
    ) { }

    async execute(request: DeletePharmacyCategoryRequest): Promise<DeletePharmacyCategoryResponse> {
        try {
            // Check if category exists before deletion
            const existingCategory = await this.pharmacyCategoryRepository.findById(request.categoryId);
            if (!existingCategory) {
                throw new AppError('Category not found', 'CATEGORY_NOT_FOUND', 404);
            }

            // Delete the category from database
            await this.pharmacyCategoryRepository.delete(request.categoryId);

            return {
                success: true,
                message: 'Category deleted successfully',
                timestamp: new Date().toISOString(),
                data: {
                    deletedCategoryId: request.categoryId
                }
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to delete category', 'DELETE_CATEGORY_ERROR', 500);
        }
    }
}