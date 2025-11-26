import { AppError } from '@/shared/errors/app-error';
import { ILabTestOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.interface';
import { UpdateLabTestOrderStatusRequest, UpdateLabTestOrderStatusResponse } from '@/domain/types/labTestAdmin/update-order-status.type';
import { IUpdateLabTestOrderStatusUseCase } from '../interfaces/labTestAdmin/update-order-status.use-case.interface';

export class UpdateLabTestOrderStatusUseCase implements IUpdateLabTestOrderStatusUseCase {
    constructor(
        private readonly labTestOrderRepository: ILabTestOrderRepository
    ) { }

    async execute(orderId: string, request: UpdateLabTestOrderStatusRequest): Promise<UpdateLabTestOrderStatusResponse> {
        // Validate input
        this.validateRequest(request);

        // Check if order exists
        const existingOrder = await this.labTestOrderRepository.findByOrderId(orderId);
        if (!existingOrder) {
            throw new AppError('Order not found', 'ORDER_NOT_FOUND', 404);
        }

        // Update the order status using the MongoDB ObjectId
        const updatedOrder = await this.labTestOrderRepository.updateStatus(existingOrder.id, request.status);

        if (!updatedOrder) {
            throw new AppError('Failed to update order status', 'UPDATE_FAILED', 500);
        }

        // Return response
        return {
            success: true,
            message: 'Lab test order status updated successfully',
            timestamp: new Date().toISOString(),
            data: {
                orderId: updatedOrder.orderId,
                status: updatedOrder.status as 'pending' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled',
                reason: request.reason,
                updatedAt: updatedOrder.updatedAt.toISOString()
            },
        };
    }

    private validateRequest(request: UpdateLabTestOrderStatusRequest): void {
        if (!request.status) {
            throw new AppError('Status is required', 'INVALID_INPUT', 400);
        }

        const validStatuses = ['pending', 'confirmed', 'sample_collected', 'processing', 'completed', 'cancelled'];
        if (!validStatuses.includes(request.status)) {
            throw new AppError('Invalid status value', 'INVALID_STATUS', 400);
        }
    }
}