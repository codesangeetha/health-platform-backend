import { Request, Response } from 'express';
import { IUpdatePrescriptionController } from '../interfaces/prescription/update-prescription.controller.interface';
import { AppError } from '@/shared/errors/app-error';
import { IUpdatePrescriptionUseCase } from '@/domain/use-cases/interfaces/prescription/update-prescription.use-case.interface';
import { UpdatePrescriptionRequest } from '@/domain/types/prescription/update-prescription.type';

export class UpdatePrescriptionController implements IUpdatePrescriptionController {
    constructor(
        private readonly updatePrescriptionUseCase: IUpdatePrescriptionUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const prescriptionId = req.params.id;

            if (!prescriptionId) {
                throw new AppError('Prescription ID is required', 'PRESCRIPTION_001', 400);
            }

            const doctorId = (req as any).user?.userId;

            if (!doctorId) {
                throw new AppError('Doctor authentication required', 'AUTHENTICATION_REQUIRED', 401);
            }

            const updateRequest: UpdatePrescriptionRequest = {
                ...req.body
            };

            const result = await this.updatePrescriptionUseCase.execute(prescriptionId, updateRequest, doctorId);

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