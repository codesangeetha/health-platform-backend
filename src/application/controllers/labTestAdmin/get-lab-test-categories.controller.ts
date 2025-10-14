import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetLabTestCategoriesUseCase } from '@/domain/use-cases/interfaces/labTestAdmin/get-lab-test-categories.use-case.interface';
import { IGetLabTestCategoriesController } from '../interfaces/labTestAdmin/get-lab-test-categories.controller.interface';

export class GetLabTestCategoriesController implements IGetLabTestCategoriesController {
    constructor(
        private readonly getLabTestCategoriesUseCase: IGetLabTestCategoriesUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { page, limit, status, search } = req.query;

            const request: any = {};
            if (page) request.page = parseInt(page as string);
            if (limit) request.limit = parseInt(limit as string);
            if (status) request.status = status as "active" | "inactive";
            if (search) request.search = search as string;

            const result = await this.getLabTestCategoriesUseCase.execute(request);

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