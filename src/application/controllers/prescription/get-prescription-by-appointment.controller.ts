import { Request, Response } from 'express';
import { IGetPrescriptionByAppointmentController } from '../interfaces/prescription/get-prescription-by-appointment.controller.interface';
import { AppError } from '@/shared/errors/app-error';
import { IGetPrescriptionByAppointmentUseCase } from '@/domain/use-cases/interfaces/prescription/get-prescription-by-appointment.use-case.interface';

export class GetPrescriptionByAppointmentController implements IGetPrescriptionByAppointmentController {
    constructor(
        private readonly getPrescriptionByAppointmentUseCase: IGetPrescriptionByAppointmentUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const appointmentId = req.params.appointmentId;

            if (!appointmentId) {
                throw new AppError('Appointment ID is required', 'PRESCRIPTION_001', 400);
            }

            const result = await this.getPrescriptionByAppointmentUseCase.execute(appointmentId);

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