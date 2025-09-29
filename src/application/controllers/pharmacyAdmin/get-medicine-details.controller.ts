import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IGetMedicineDetailsUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/get-medicine-details.use-case.interface';
import { GetMedicineDetailsRequest } from '@/domain/types/pharmacyAdmin/get-medicine-details.type';
import { IGetMedicineDetailsController } from '../interfaces/pharmacyAdmin/get-medicine-details.controller.interface';

export class GetMedicineDetailsController implements IGetMedicineDetailsController {
    constructor(
        private readonly getMedicineDetailsUseCase: IGetMedicineDetailsUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            const { medicineId } = request.params;

            if (!medicineId) {
                response.status(400).json({
                    success: false,
                    message: 'Medicine ID is required',
                    error: 'MISSING_MEDICINE_ID',
                    timestamp: new Date().toISOString()
                });
                return;
            }

            const getMedicineDetailsRequest: GetMedicineDetailsRequest = {
                medicineId: medicineId
            };

            const result = await this.getMedicineDetailsUseCase.execute(getMedicineDetailsRequest);

            response.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                response.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.errorCode,
                    timestamp: new Date().toISOString()
                });
            } else {
                response.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: 'INTERNAL_SERVER_ERROR',
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
}