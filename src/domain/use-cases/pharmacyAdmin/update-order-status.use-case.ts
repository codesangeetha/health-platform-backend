import { AppError } from '@/shared/errors/app-error';
import { IMedicineOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-order-repository.interface';
import { UpdateOrderStatusRequest, UpdateOrderStatusResponse } from '@/domain/types/pharmacyAdmin/update-order-status.type';
import { IUpdateOrderStatusUseCase } from '../interfaces/pharmacyAdmin/update-order-status.use-case.interface';

export class UpdateOrderStatusUseCase implements IUpdateOrderStatusUseCase {
    constructor(
        private readonly medicineOrderRepository: IMedicineOrderRepository
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