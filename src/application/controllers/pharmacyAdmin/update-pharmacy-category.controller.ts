import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IUpdatePharmacyCategoryUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/update-pharmacy-category.use-case.interface';
import { UpdatePharmacyCategoryRequest } from '@/domain/types/pharmacyAdmin/update-pharmacy-category.type';
import { IUpdatePharmacyCategoryController } from '../interfaces/pharmacyAdmin/update-pharmacy-category.controller.interface';

export class UpdatePharmacyCategoryController implements IUpdatePharmacyCategoryController {
    constructor(
        private readonly updatePharmacyCategoryUseCase: IUpdatePharmacyCategoryUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const { categoryId } = request.params;

            if (!categoryId) {
                response.status(400).json({
                    success: false,
                    message: 'Category ID is required',
                    error: 'MISSING_CATEGORY_ID',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const {
                name,
                description,
                status
            } = request.body;

            // Get the user ID from the authenticated user (from auth middleware)
            const editedBy = (request as any).user?.id;

            const updateCategoryRequest: UpdatePharmacyCategoryRequest = {
                name: name,
                description: description,
                status: status,
                editedBy: editedBy
            };

            const result = await this.updatePharmacyCategoryUseCase.execute(updateCategoryRequest, categoryId);

            response.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                response.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.errorCode,
                    timestamp: new Date().toISOString()
                });
            } else {
                response.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: 'INTERNAL_SERVER_ERROR',
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
}