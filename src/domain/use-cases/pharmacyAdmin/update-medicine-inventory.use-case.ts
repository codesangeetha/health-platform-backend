import { AppError } from '@/shared/errors/app-error';
import { IMedicineRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository.interface';
import { IUpdateMedicineInventoryUseCase } from '../interfaces/pharmacyAdmin/update-medicine-inventory.use-case.interface';
import { UpdateMedicineInventoryRequest, UpdateMedicineInventoryResponse } from '@/domain/types/pharmacyAdmin/update-medicine-inventory.type';

export class UpdateMedicineInventoryUseCase implements IUpdateMedicineInventoryUseCase {
    constructor(
        private readonly medicineRepository: IMedicineRepository
    ) { }

    async execute(request: UpdateMedicineInventoryRequest): Promise<UpdateMedicineInventoryResponse> {
        try {
            // Validate that at least one field is provided for update
            if (request.stock === undefined && request.price === undefined && request.status === undefined) {
                throw new AppError('At least one field (stock, price, or status) must be provided for update', 'INVALID_UPDATE_DATA', 400);
            }

            // Validate stock if provided
            if (request.stock !== undefined && request.stock < 0) {
                throw new AppError('Stock cannot be negative', 'INVALID_STOCK', 400);
            }

            // Validate price if provided
            if (request.price !== undefined && request.price < 0) {
                throw new AppError('Price cannot be negative', 'INVALID_PRICE', 400);
            }

            // Validate status if provided
            if (request.status !== undefined && !['active', 'inactive'].includes(request.status)) {
                throw new AppError('Status must be either active or inactive', 'INVALID_STATUS', 400);
            }

            const updateData: any = {};
            if (request.stock !== undefined) updateData.stock = request.stock;
            if (request.price !== undefined) updateData.price = request.price;
            if (request.status !== undefined) updateData.status = request.status;

            const updatedMedicine = await this.medicineRepository.updateInventory(
                request.medicineId,
                updateData
            );

            return {
                success: true,
                message: 'Inventory updated successfully',
                data: {
                    medicineId: updatedMedicine.id,
                    stock: updatedMedicine.stock,
                    price: updatedMedicine.price,
                    status: updatedMedicine.status,
                    updatedAt: updatedMedicine.updatedAt
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to update medicine inventory', 'UPDATE_INVENTORY_ERROR', 500);
        }
    }
}