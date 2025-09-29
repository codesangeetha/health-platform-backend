import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IUpdateMedicineInventoryUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/update-medicine-inventory.use-case.interface';
import { UpdateMedicineInventoryRequest } from '@/domain/types/pharmacyAdmin/update-medicine-inventory.type';
import { IUpdateMedicineInventoryController } from '../interfaces/pharmacyAdmin/update-medicine-inventory.controller.interface';

export class UpdateMedicineInventoryController implements IUpdateMedicineInventoryController {
    constructor(
        private readonly updateMedicineInventoryUseCase: IUpdateMedicineInventoryUseCase
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

            const { stock, price, status } = request.body;

            const updateMedicineInventoryRequest: UpdateMedicineInventoryRequest = {
                medicineId: medicineId,
                stock: stock,
                price: price,
                status: status
            };

            const result = await this.updateMedicineInventoryUseCase.execute(updateMedicineInventoryRequest);

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