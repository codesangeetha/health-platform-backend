import { AppError } from '@/shared/errors/app-error';
import { IMedicineOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-order-repository.interface';
import { IMedicineRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository.interface';
import { UpdateOrderStatusRequest, UpdateOrderStatusResponse } from '@/domain/types/pharmacyAdmin/update-order-status.type';
import { IUpdateOrderStatusUseCase } from '../interfaces/pharmacyAdmin/update-order-status.use-case.interface';

export class UpdateOrderStatusUseCase implements IUpdateOrderStatusUseCase {
    constructor(
        private readonly medicineOrderRepository: IMedicineOrderRepository,
        private readonly medicineRepository: IMedicineRepository
    ) { }

    async execute(orderId: string, request: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
        // Validate input
        this.validateRequest(request);

        // Check if order exists
        const existingOrder = await this.medicineOrderRepository.findByOrderId(orderId);
        if (!existingOrder) {
            throw new AppError('Order not found', 'ORDER_NOT_FOUND', 404);
        }

        // Update the order status using the MongoDB ObjectId
        const updatedOrder = await this.medicineOrderRepository.updateStatus(existingOrder.id, request.status);

        if (!updatedOrder) {
            throw new AppError('Failed to update order status', 'UPDATE_FAILED', 500);
        }

        // If order status is changed to 'completed', reduce medicine stock
        if (request.status === 'completed') {
            await this.reduceMedicineStock(updatedOrder.items);
        }

        // Return response
        return {
            success: true,
            message: 'Order status updated successfully',
            timestamp: new Date().toISOString(),
            data: {
                orderId: updatedOrder.orderId,
                status: updatedOrder.status as 'pending' | 'completed' | 'cancelled',
                reason: request.reason,
                updatedAt: updatedOrder.updatedAt.toISOString()
            },
        };
    }

    private async reduceMedicineStock(items: any[]): Promise<void> {
        try {
            for (const item of items) {
                if (item.medicineId && item.quantity) {
                    // Find the current medicine to get its stock
                    const medicine = await this.medicineRepository.findById(item.medicineId);
                    if (!medicine) {
                        console.warn(`Medicine with ID ${item.medicineId} not found`);
                        continue;
                    }

                    // Calculate new stock
                    const newStock = Math.max(0, medicine.stock - item.quantity);

                    // Check if stock would go negative
                    if (medicine.stock < item.quantity) {
                        console.warn(`Insufficient stock for medicine ${item.medicineId}. Current stock: ${medicine.stock}, Required: ${item.quantity}`);
                    }

                    // Update the medicine stock
                    await this.medicineRepository.updateInventory(item.medicineId, { stock: newStock });
                    console.log(`Reduced stock for medicine ${item.medicineId} from ${medicine.stock} to ${newStock}`);
                }
            }
        } catch (error) {
            console.error('Error reducing medicine stock:', error);
            // Don't throw error here to avoid breaking the order status update
            // Stock reduction should not prevent order status from being updated
        }
    }

    private validateRequest(request: UpdateOrderStatusRequest): void {
        if (!request.status) {
            throw new AppError('Status is required', 'INVALID_INPUT', 400);
        }

        const validStatuses = ['pending', 'completed', 'cancelled'];
        if (!validStatuses.includes(request.status)) {
            throw new AppError('Invalid status value', 'INVALID_STATUS', 400);
        }
    }
}