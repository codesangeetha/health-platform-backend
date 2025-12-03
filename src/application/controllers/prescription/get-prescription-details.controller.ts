import { Request, Response } from 'express';
import { IGetPrescriptionDetailsController } from '../interfaces/prescription/get-prescription-details.controller.interface';
import { AppError } from '@/shared/errors/app-error';
import { IGetPrescriptionDetailsUseCase } from '@/domain/use-cases/interfaces/prescription/get-prescription-details.use-case.interface';

export class GetPrescriptionDetailsController implements IGetPrescriptionDetailsController {
    constructor(
        private readonly getPrescriptionDetailsUseCase: IGetPrescriptionDetailsUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const appointmentId = req.params.appointmentId;

            if (!appointmentId) {
                throw new AppError('Appointment ID is required', 'PRESCRIPTION_DETAILS_001', 400);
            }

            const result = await this.getPrescriptionDetailsUseCase.execute(appointmentId);

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