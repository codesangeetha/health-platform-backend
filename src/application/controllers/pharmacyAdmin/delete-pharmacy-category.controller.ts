import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IDeletePharmacyCategoryUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/delete-pharmacy-category.use-case.interface';
import { DeletePharmacyCategoryRequest } from '@/domain/types/pharmacyAdmin/delete-pharmacy-category.type';
import { IDeletePharmacyCategoryController } from '../interfaces/pharmacyAdmin/delete-pharmacy-category.controller.interface';

export class DeletePharmacyCategoryController implements IDeletePharmacyCategoryController {
    constructor(
        private readonly deletePharmacyCategoryUseCase: IDeletePharmacyCategoryUseCase
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

            const deleteCategoryRequest: DeletePharmacyCategoryRequest = {
                categoryId: categoryId
            };

            const result = await this.deletePharmacyCategoryUseCase.execute(deleteCategoryRequest);

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