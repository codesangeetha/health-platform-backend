// src/application/controllers/pharmacyAdmin/get-patient-orders.controller.ts
import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetPatientOrdersUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/get-patient-orders.use-case.interface';
import { IGetPatientOrdersController } from '../interfaces/pharmacyAdmin/get-patient-orders.controller.interface';
import { User } from '@/domain/entities/user.entity';

export class GetPatientOrdersController implements IGetPatientOrdersController {
    constructor(
        private readonly getPatientOrdersUseCase: IGetPatientOrdersUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            // Extract query parameters
            const { status, page = '1', limit = '10' } = req.query;

            // Get user ID from authenticated user (assuming middleware sets this)
            const userId = (req as any).user?.userId;
            if (!userId) {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            // Validate and parse pagination parameters
            const pageNum = parseInt(page as string, 10);
            const limitNum = parseInt(limit as string, 10);

            // Execute use case
            const result = await this.getPatientOrdersUseCase.execute({
                status: status as any,
                page: pageNum,
                limit: limitNum,
                userId
            });

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