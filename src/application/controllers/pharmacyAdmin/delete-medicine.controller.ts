import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IDeleteMedicineUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/delete-medicine.use-case.interface';
import { DeleteMedicineRequest } from '@/domain/types/pharmacyAdmin/delete-medicine.type';
import { IDeleteMedicineController } from '../interfaces/pharmacyAdmin/delete-medicine.controller.interface';

export class DeleteMedicineController implements IDeleteMedicineController {
    constructor(
        private readonly deleteMedicineUseCase: IDeleteMedicineUseCase
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

            const deleteMedicineRequest: DeleteMedicineRequest = {
                medicineId: medicineId
            };

            const result = await this.deleteMedicineUseCase.execute(deleteMedicineRequest);

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