// src/application/controllers/labTestOrder/get-lab-test-order-by-id.controller.ts
import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetLabTestOrderByIdUseCase } from '@/domain/use-cases/interfaces/labTestOrder/get-lab-test-order-by-id.use-case.interface';
import { IGetLabTestOrderByIdController } from '../interfaces/labTestOrder/get-lab-test-order-by-id.controller.interface';

export class GetLabTestOrderByIdController implements IGetLabTestOrderByIdController {
    constructor(
        private readonly getLabTestOrderByIdUseCase: IGetLabTestOrderByIdUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_CONTROLLER: Starting request');
            console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_CONTROLLER: Params:', req.params);
            console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_CONTROLLER: Raw user object:', (req as any).user);
            console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_CONTROLLER: User keys:', (req as any).user ? Object.keys((req as any).user) : 'No user object');

            // Extract orderId from URL parameters
            const { orderId } = req.params;
            if (!orderId) {
                throw new AppError('Order ID is required', 'ORDER_ID_REQUIRED', 400);
            }

            // Get user ID from authenticated user (check both userId and id fields)
            const user = (req as any).user;
            if (!user) {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            const userId = user.userId || user.id;
            if (!userId) {
                console.error('🔍 GET_LAB_TEST_ORDER_BY_ID_CONTROLLER: No userId or id found in user object:', user);
                throw new AppError('User ID not found in token', 'USER_ID_MISSING', 401);
            }

            console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_CONTROLLER: Extracted orderId and userId:', { orderId, userId });

            // Execute use case
            console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_CONTROLLER: Calling use case...');
            const result = await this.getLabTestOrderByIdUseCase.execute({
                orderId,
                userId
            });

            console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_CONTROLLER: Use case completed successfully');
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