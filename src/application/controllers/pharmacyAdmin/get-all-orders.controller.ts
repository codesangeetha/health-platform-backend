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
            const { patientId, patientName, status, dateFrom, dateTo, orderType, amountMin, amountMax, page = '1', limit = '10' } = req.query;

            // Validate and parse pagination parameters
            const pageNum = parseInt(page as string, 10);
            const limitNum = parseInt(limit as string, 10);

            // Build request object with only defined values
            const request: any = {
                page: pageNum,
                limit: limitNum
            };

            // Add optional parameters only if they are defined
            if (patientId) request.patientId = patientId as string;
            if (patientName) request.patientName = patientName as string;
            if (status) request.status = status as any;
            if (dateFrom) request.dateFrom = dateFrom as string;
            if (dateTo) request.dateTo = dateTo as string;
            if (orderType) request.orderType = orderType as any;
            if (amountMin) request.amountMin = parseFloat(amountMin as string);
            if (amountMax) request.amountMax = parseFloat(amountMax as string);

            const result = await this.getAllOrdersUseCase.execute(request);

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