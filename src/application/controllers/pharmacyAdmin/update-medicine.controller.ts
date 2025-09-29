import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IUpdateMedicineUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/update-medicine.use-case.interface';
import { UpdateMedicineRequest } from '@/domain/types/pharmacyAdmin/update-medicine.type';
import { IUpdateMedicineController } from '../interfaces/pharmacyAdmin/update-medicine.controller.interface';

export class UpdateMedicineController implements IUpdateMedicineController {
    constructor(
        private readonly updateMedicineUseCase: IUpdateMedicineUseCase
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

            const {
                name,
                genericName,
                category,
                manufacturer,
                price,
                description,
                dosage,
                sideEffects,
                interactions,
                ingredients,
                storage,
                status
            } = request.body;

            const updateMedicineRequest: UpdateMedicineRequest = {
                medicineId: medicineId,
                name: name,
                genericName: genericName,
                category: category,
                manufacturer: manufacturer,
                price: price,
                description: description,
                dosage: dosage,
                sideEffects: sideEffects,
                interactions: interactions,
                ingredients: ingredients,
                storage: storage,
                status: status
            };

            const result = await this.updateMedicineUseCase.execute(updateMedicineRequest);

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