import { AppError } from '@/shared/errors/app-error';
import { UpdatePharmacyCategoryRequest, UpdatePharmacyCategoryResponse } from '@/domain/types/pharmacyAdmin/update-pharmacy-category.type';
import { IPharmacyCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/pharmacyCategory-repository.interface';
import { IUpdatePharmacyCategoryUseCase } from '../interfaces/pharmacyAdmin/update-pharmacy-category.use-case.interface';

export class UpdatePharmacyCategoryUseCase implements IUpdatePharmacyCategoryUseCase {
    constructor(
        private readonly pharmacyCategoryRepository: IPharmacyCategoryRepository
    ) { }

    async execute(request: UpdatePharmacyCategoryRequest, categoryId: string): Promise<UpdatePharmacyCategoryResponse> {
        try {
            // Validate that at least one field is provided for update
            const updatableFields = ['name', 'description', 'status', 'editedBy'];
            const hasAtLeastOneField = updatableFields.some(field => request[field as keyof UpdatePharmacyCategoryRequest] !== undefined);
            if (!hasAtLeastOneField) {
                throw new AppError('At least one field must be provided for update', 'INVALID_UPDATE_DATA', 400);
            }

            // Validate status if provided
            if (request.status !== undefined && !['active', 'inactive'].includes(request.status)) {
                throw new AppError('Status must be either active or inactive', 'INVALID_STATUS', 400);
            }

            // Check if category exists before updating
            const existingCategory = await this.pharmacyCategoryRepository.findById(categoryId);
            if (!existingCategory) {
                throw new AppError('Category not found', 'CATEGORY_NOT_FOUND', 404);
            }

            // Build update object dynamically
            const updateData: any = {};
            if (request.name !== undefined) updateData.name = request.name;
            if (request.description !== undefined) updateData.description = request.description;
            if (request.status !== undefined) updateData.status = request.status;
            if (request.editedBy !== undefined) updateData.editedBy = request.editedBy;

            const updatedCategory = await this.pharmacyCategoryRepository.update(categoryId, updateData);

            return {
                success: true,
                message: 'Category updated successfully',
                timestamp: new Date().toISOString(),
                data: {
                    categoryId: updatedCategory.id,
                    name: updatedCategory.name,
                    status: updatedCategory.status,
                    updatedAt: updatedCategory.updatedAt.toISOString()
                }
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to update category', 'UPDATE_CATEGORY_ERROR', 500);
        }
    }
}