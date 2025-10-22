import { AppError } from '@/shared/errors/app-error';
import { IMedicineRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository.interface';
import { IUpdateMedicineUseCase } from '../interfaces/pharmacyAdmin/update-medicine.use-case.interface';
import { UpdateMedicineRequest, UpdateMedicineResponse } from '@/domain/types/pharmacyAdmin/update-medicine.type';

export class UpdateMedicineUseCase implements IUpdateMedicineUseCase {
    constructor(
        private readonly medicineRepository: IMedicineRepository
    ) { }

    async execute(request: UpdateMedicineRequest): Promise<UpdateMedicineResponse> {
        try {
            // Validate that at least one field is provided for update
            const updatableFields = [
                'name', 'genericName', 'category', 'manufacturer', 'price',
                'description', 'dosage', 'sideEffects', 'interactions',
                'ingredients', 'storage', 'status'
            ];

            const hasAtLeastOneField = updatableFields.some(field => request[field as keyof UpdateMedicineRequest] !== undefined);
            if (!hasAtLeastOneField) {
                throw new AppError('At least one field must be provided for update', 'INVALID_UPDATE_DATA', 400);
            }

            // Validate price if provided
            if (request.price !== undefined && request.price < 0) {
                throw new AppError('Price cannot be negative', 'INVALID_PRICE', 400);
            }

            // Validate status if provided
            if (request.status !== undefined && !['active', 'inactive'].includes(request.status)) {
                throw new AppError('Status must be either active or inactive', 'INVALID_STATUS', 400);
            }

            // Build update object dynamically
            const updateData: any = {};
            if (request.name !== undefined) updateData.name = request.name;
            if (request.genericName !== undefined) updateData.genericName = request.genericName;
            if (request.category !== undefined) updateData.category = request.category;
            if (request.manufacturer !== undefined) updateData.manufacturer = request.manufacturer;
            if (request.price !== undefined) updateData.price = request.price;
            if (request.description !== undefined) updateData.description = request.description;
            if (request.dosage !== undefined) updateData.dosage = request.dosage;
            if (request.sideEffects !== undefined) updateData.sideEffects = request.sideEffects;
            if (request.interactions !== undefined) updateData.interactions = request.interactions;
            if (request.ingredients !== undefined) updateData.ingredients = request.ingredients;
            if (request.storage !== undefined) updateData.storage = request.storage;
            if (request.status !== undefined) updateData.status = request.status;

            const updatedMedicine = await this.medicineRepository.update(
                request.medicineId,
                updateData
            );

            return {
                success: true,
                message: 'Medicine updated successfully',
                data: {
                    medicineId: updatedMedicine.id,
                    name: updatedMedicine.name,
                    price: updatedMedicine.price,
                    status: updatedMedicine.status,
                    updatedAt: updatedMedicine.updatedAt.toISOString()
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to update medicine', 'UPDATE_MEDICINE_ERROR', 500);
        }
    }
}