// src/application/controllers/pharmacyAdmin/get-all-orders.controller.ts
import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetAllOrdersUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/get-all-orders.use-case.interface';
import { IGetAllOrdersController } from '../interfaces/pharmacyAdmin/get-all-orders.controller.interface';

export class GetAllOrdersController implements IGetAllOrdersController {
    constructor(
        private readonly getAllOrdersUseCase: IGetAllOrdersUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            // Extract query parameters
            const { patientId, status, createdDate, orderType, page = '1', limit = '10' } = req.query;

            // Validate and parse pagination parameters
            const pageNum = parseInt(page as string, 10);
            const limitNum = parseInt(limit as string, 10);

            // Execute use case
            const result = await this.getAllOrdersUseCase.execute({
                patientId: patientId as string,
                status: status as any,
                createdDate: createdDate as string,
                orderType: orderType as any,
                page: pageNum,
                limit: limitNum
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