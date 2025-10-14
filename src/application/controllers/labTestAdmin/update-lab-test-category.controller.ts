import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IUpdateLabTestCategoryUseCase } from '@/domain/use-cases/interfaces/labTestAdmin/update-lab-test-category.use-case.interface';
import { IUpdateLabTestCategoryController } from '../interfaces/labTestAdmin/update-lab-test-category.controller.interface';

export class UpdateLabTestCategoryController implements IUpdateLabTestCategoryController {
    constructor(
        private readonly updateLabTestCategoryUseCase: IUpdateLabTestCategoryUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const tokenUserType = (req as any).user?.userType;

            if (tokenUserType !== "admin") {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            const { id } = req.params;

            if (!id) {
                throw new AppError('Category ID is required', 'VALIDATION_001', 400);
            }

            const result = await this.updateLabTestCategoryUseCase.execute(id, req.body);

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