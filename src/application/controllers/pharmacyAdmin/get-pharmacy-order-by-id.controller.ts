// src/application/controllers/pharmacyAdmin/get-pharmacy-order-by-id.controller.ts
import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetPharmacyOrderByIdUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/get-pharmacy-order-by-id.use-case.interface';
import { IGetPharmacyOrderByIdController } from '../interfaces/pharmacyAdmin/get-pharmacy-order-by-id.controller.interface';

export class GetPharmacyOrderByIdController implements IGetPharmacyOrderByIdController {
    constructor(
        private readonly getPharmacyOrderByIdUseCase: IGetPharmacyOrderByIdUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            console.log('🔍 GET_PHARMACY_ORDER_BY_ID_CONTROLLER: Starting request');
            console.log('🔍 GET_PHARMACY_ORDER_BY_ID_CONTROLLER: Params:', req.params);
            console.log('🔍 GET_PHARMACY_ORDER_BY_ID_CONTROLLER: Raw user object:', (req as any).user);

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
                console.error('🔍 GET_PHARMACY_ORDER_BY_ID_CONTROLLER: No userId or id found in user object:', user);
                throw new AppError('User ID not found in token', 'USER_ID_MISSING', 401);
            }

            console.log('🔍 GET_PHARMACY_ORDER_BY_ID_CONTROLLER: Extracted orderId and userId:', { orderId, userId });

            // Get user type for admin access check
            const userType = user.userType || user.role;

            // Execute use case
            console.log('🔍 GET_PHARMACY_ORDER_BY_ID_CONTROLLER: Calling use case...');
            const result = await this.getPharmacyOrderByIdUseCase.execute({
                orderId,
                userId,
                userType
            });

            console.log('🔍 GET_PHARMACY_ORDER_BY_ID_CONTROLLER: Use case completed successfully');
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
