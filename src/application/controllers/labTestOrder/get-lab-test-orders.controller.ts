// src/application/controllers/labTestOrder/get-lab-test-orders.controller.ts
import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetLabTestOrdersUseCase } from '@/domain/use-cases/interfaces/labTestOrder/get-lab-test-orders.use-case.interface';
import { IGetLabTestOrdersController } from '../interfaces/labTestOrder/get-lab-test-orders.controller.interface';

export class GetLabTestOrdersController implements IGetLabTestOrdersController {
    constructor(
        private readonly getLabTestOrdersUseCase: IGetLabTestOrdersUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            console.log('🔍 GET_LAB_TEST_ORDERS_CONTROLLER: Starting request');
            console.log('🔍 GET_LAB_TEST_ORDERS_CONTROLLER: Query params:', req.query);
            console.log('🔍 GET_LAB_TEST_ORDERS_CONTROLLER: Raw user object:', (req as any).user);
            console.log('🔍 GET_LAB_TEST_ORDERS_CONTROLLER: User keys:', (req as any).user ? Object.keys((req as any).user) : 'No user object');

            // Extract query parameters
            const { status, page = '1', limit = '10', startDate, endDate } = req.query;

            // Get user ID from authenticated user (check both userId and id fields)
            const user = (req as any).user;
            if (!user) {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            const userId = user.userId || user.id;
            if (!userId) {
                console.error('🔍 GET_LAB_TEST_ORDERS_CONTROLLER: No userId or id found in user object:', user);
                throw new AppError('User ID not found in token', 'USER_ID_MISSING', 401);
            }

            console.log('🔍 GET_LAB_TEST_ORDERS_CONTROLLER: Extracted userId:', userId);

            // Validate and parse pagination parameters
            const pageNum = parseInt(page as string, 10);
            const limitNum = parseInt(limit as string, 10);

            console.log('🔍 GET_LAB_TEST_ORDERS_CONTROLLER: Parsed params:', {
                status, pageNum, limitNum, startDate, endDate, userId
            });

            // Execute use case
            console.log('🔍 GET_LAB_TEST_ORDERS_CONTROLLER: Calling use case...');
            const result = await this.getLabTestOrdersUseCase.execute({
                status: status as any,
                page: pageNum,
                limit: limitNum,
                startDate: startDate as string,
                endDate: endDate as string,
                userId
            });

            console.log('🔍 GET_LAB_TEST_ORDERS_CONTROLLER: Use case completed successfully');
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