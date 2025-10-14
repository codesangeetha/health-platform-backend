import { Request, Response } from 'express';
import { IGetPrescriptionController } from '../interfaces/prescription/get-prescription.controller.interface';
import { AppError } from '@/shared/errors/app-error';
import { IGetPrescriptionUseCase } from '@/domain/use-cases/interfaces/prescription/get-prescription.use-case.interface';

export class GetPrescriptionController implements IGetPrescriptionController {
    constructor(
        private readonly getPrescriptionUseCase: IGetPrescriptionUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const prescriptionId = req.params.id;

            if (!prescriptionId) {
                throw new AppError('Prescription ID is required', 'PRESCRIPTION_001', 400);
            }

            const result = await this.getPrescriptionUseCase.execute(prescriptionId);

            res.status(200).json(result);

        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.errorCode
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: 'INTERNAL_SERVER_ERROR'
                });
            }
        }
    }
}