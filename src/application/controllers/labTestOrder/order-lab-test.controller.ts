// src/application/controllers/labTestOrder/order-lab-test.controller.ts
import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IOrderLabTestUseCase } from '@/domain/use-cases/interfaces/labTestOrder/order-lab-test.use-case.interface';
import { IOrderLabTestController } from '../interfaces/labTestOrder/order-lab-test.controller.interface';

export class OrderLabTestController implements IOrderLabTestController {
    constructor(
        private readonly orderLabTestUseCase: IOrderLabTestUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            // Extract request data
            const { testItems, deliveryAddress, collectionMethod, scheduledDate, collectionAddress, prescriptionId } = req.body;

            // Validate required fields
            if (!testItems || !deliveryAddress || !collectionMethod || !prescriptionId) {
                throw new AppError('Missing required fields: testItems, deliveryAddress, collectionMethod, and prescriptionId are required', 'LAB_ORDER_FIELDS_REQUIRED', 400);
            }

            // Validate delivery address
            if (deliveryAddress) {
                const addressFields = ['street', 'city', 'state', 'zipCode', 'country'];
                for (const field of addressFields) {
                    if (!deliveryAddress[field as keyof typeof deliveryAddress]) {
                        throw new AppError(`Missing required delivery address field: ${field}`, 'LAB_ORDER_003', 400);
                    }
                }
            }

            // Validate collection address if collection method is home_collection
            if (collectionMethod === 'home_collection' && collectionAddress) {
                const addressFields = ['street', 'city', 'state', 'zipCode', 'country'];
                for (const field of addressFields) {
                    if (!collectionAddress[field as keyof typeof collectionAddress]) {
                        throw new AppError(`Missing required collection address field: ${field}`, 'LAB_ORDER_009', 400);
                    }
                }
            }

            // Execute use case
            const result = await this.orderLabTestUseCase.execute({
                testItems,
                deliveryAddress,
                collectionMethod,
                scheduledDate,
                collectionAddress,
                prescriptionId
            });

            res.status(201).json(result);

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