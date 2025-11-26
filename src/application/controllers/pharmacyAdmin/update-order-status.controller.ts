// src/application/controllers/pharmacyAdmin/update-order-status.controller.ts
import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IUpdateOrderStatusUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/update-order-status.use-case.interface';
import { IUpdateOrderStatusController } from '../interfaces/pharmacyAdmin/update-order-status.controller.interface';
import { UpdateOrderStatusRequest } from '@/domain/types/pharmacyAdmin/update-order-status.type';

export class UpdateOrderStatusController implements IUpdateOrderStatusController {
    constructor(
        private readonly updateOrderStatusUseCase: IUpdateOrderStatusUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            // Extract order ID from route parameters
            const { orderId } = req.params;
            
            if (!orderId) {
                res.status(400).json({
                    success: false,
                    message: 'Order ID is required',
                    error: 'MISSING_ORDER_ID'
                });
                return;
            }

            // Extract request body data
            const { status, reason } = req.body;

            // Build request object
            const request: UpdateOrderStatusRequest = {
                status,
                reason
            };

            // Call the use case
            const result = await this.updateOrderStatusUseCase.execute(orderId, request);

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