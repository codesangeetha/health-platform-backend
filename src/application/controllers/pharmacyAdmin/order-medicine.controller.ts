// src/application/controllers/pharmacyAdmin/order-medicine.controller.ts
import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IOrderMedicineUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/order-medicine.use-case.interface';
import { IOrderMedicineController } from '../interfaces/pharmacyAdmin/order-medicine.controller.interface';

export class OrderMedicineController implements IOrderMedicineController {
    constructor(
        private readonly orderMedicineUseCase: IOrderMedicineUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            // Extract request data
            const { prescriptionId, items, deliveryAddress, deliveryMethod } = req.body;

            // Validate required fields
            if (!prescriptionId || !items || !deliveryAddress || !deliveryMethod) {
                throw new AppError('Missing required fields', 'ORDER_FIELDS_REQUIRED', 400);
            }

            // Get patient ID from authenticated user
            const patientId = (req as any).user?.userId;
            if (!patientId) {
                throw new AppError('Patient ID is required. Please ensure you are authenticated as a patient.', 'PATIENT_ID_REQUIRED', 401);
            }

            // Execute use case
            const result = await this.orderMedicineUseCase.execute({
                prescriptionId,
                patientId,
                items,
                deliveryAddress,
                deliveryMethod
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