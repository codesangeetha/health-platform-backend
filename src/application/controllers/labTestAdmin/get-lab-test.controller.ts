import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetLabTestUseCase } from '@/domain/use-cases/interfaces/labTestAdmin/get-lab-test.use-case.interface';
import { IGetLabTestController } from '../interfaces/labTestAdmin/get-lab-test.controller.interface';

export class GetLabTestController implements IGetLabTestController {
    constructor(
        private readonly getLabTestUseCase: IGetLabTestUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                throw new AppError('Test ID is required', 'VALIDATION_001', 400);
            }

            const result = await this.getLabTestUseCase.execute(id);

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