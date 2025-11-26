// src/application/controllers/labTestAdmin/update-order-status.controller.ts
import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IUpdateLabTestOrderStatusUseCase } from '@/domain/use-cases/interfaces/labTestAdmin/update-order-status.use-case.interface';
import { IUpdateLabTestOrderStatusController } from '../interfaces/labTestAdmin/update-order-status.controller.interface';
import { UpdateLabTestOrderStatusRequest } from '@/domain/types/labTestAdmin/update-order-status.type';

export class UpdateLabTestOrderStatusController implements IUpdateLabTestOrderStatusController {
    constructor(
        private readonly updateLabTestOrderStatusUseCase: IUpdateLabTestOrderStatusUseCase
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
            const request: UpdateLabTestOrderStatusRequest = {
                status,
                reason
            };

            // Call the use case
            const result = await this.updateLabTestOrderStatusUseCase.execute(orderId, request);

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