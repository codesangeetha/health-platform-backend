import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetMedCategoryUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/get-med-category.use-case.interface';
import { GetPharmacyCategoriesRequest } from '@/domain/types/pharmacyAdmin/get-med-category.type';
import { IGetMedCategoryController } from '../interfaces/pharmacyAdmin/get-med-category.controller.interface';

export class GetMedCategoryController implements IGetMedCategoryController {
    constructor(
        private readonly getMedCategoryUseCase: IGetMedCategoryUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            //Get page and limit from query params
            const page = request.query.page ? parseInt(request.query.page as string, 10) : 1;
            const limit = request.query.limit ? parseInt(request.query.limit as string, 10) : 10;

            const getMedCategoryReq: GetPharmacyCategoriesRequest = {
                page: page,
                limit: limit,
                status: request.query.status as any,
                name: request.query.name as any,
                description: request.query.description as any,
                fromDate: request.query.fromDate as any,
                toDate: request.query.toDate as any
            };

            const result = await this.getMedCategoryUseCase.execute(getMedCategoryReq);

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