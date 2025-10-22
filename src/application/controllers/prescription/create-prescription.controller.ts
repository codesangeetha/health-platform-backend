import { Request, Response } from 'express';
import { ICreatePrescriptionController } from '../interfaces/prescription/create-prescription.controller.interface';
import { AppError } from '@/shared/errors/app-error';
import { ICreatePrescriptionUseCase } from '@/domain/use-cases/interfaces/prescription/create-prescription.use-case.interface';
import { CreatePrescriptionRequest } from '@/domain/types/prescription/create-prescription.type';

export class CreatePrescriptionController implements ICreatePrescriptionController {
    constructor(
        private readonly createPrescriptionUseCase: ICreatePrescriptionUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const doctorId = (req as any).user?.userId;

            if (!doctorId) {
                throw new AppError('Doctor authentication required', 'AUTHENTICATION_REQUIRED', 401);
            }

            const prescriptionRequest: CreatePrescriptionRequest = {
                ...req.body
            };

            const result = await this.createPrescriptionUseCase.execute(prescriptionRequest, doctorId);

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