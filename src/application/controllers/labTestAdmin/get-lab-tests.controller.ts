import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetLabTestsUseCase } from '@/domain/use-cases/interfaces/labTestAdmin/get-lab-tests.use-case.interface';
import { IGetLabTestsController } from '../interfaces/labTestAdmin/get-lab-tests.controller.interface';

export class GetLabTestsController implements IGetLabTestsController {
    constructor(
        private readonly getLabTestsUseCase: IGetLabTestsUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const {
                page,
                limit,
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
                sortBy,
                sortOrder
            } = req.query;

            const request: any = {};
            if (page) request.page = parseInt(page as string);
            if (limit) request.limit = parseInt(limit as string);
            if (categoryId) request.categoryId = categoryId as string;
            if (isActive !== undefined) request.isActive = isActive === 'true';
            if (search) request.search = search as string;
            if (name) request.name = name as string;
            if (description) request.description = description as string;
            if (status) request.status = status as string;
            if (minPrice !== undefined) request.minPrice = parseFloat(minPrice as string);
            if (maxPrice !== undefined) request.maxPrice = parseFloat(maxPrice as string);
            if (createdFrom) request.createdFrom = createdFrom as string;
            if (createdTo) request.createdTo = createdTo as string;
            if (sortBy) request.sortBy = sortBy as string;
            if (sortOrder) request.sortOrder = sortOrder as 'asc' | 'desc';

            const result = await this.getLabTestsUseCase.execute(request);

            res.status(200).json(result);

        } catch (error) {
            if (error instanceof AppError) {
                console.log('AppError caught:', {
                    message: error.message,
                    errorCode: error.errorCode,
                    statusCode: error.statusCode
                });

                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.errorCode
                });
            } else {
                console.log('Non-AppError caught, sending generic 500 response');

                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: 'INTERNAL_SERVER_ERROR'
                });
            }
        }
    }
}