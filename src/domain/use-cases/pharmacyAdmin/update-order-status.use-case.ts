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

        // Handle new individual medicine status format
        if (request.medicines && request.medicines.length > 0) {
            return this.handleIndividualMedicineUpdates(existingOrder, request);
        }

        // Update the order status using the MongoDB ObjectId for legacy format
        const updatedOrder = await this.medicineOrderRepository.updateStatus(existingOrder.id, request.status);

        if (!updatedOrder) {
            throw new AppError('Failed to update order status', 'UPDATE_FAILED', 500);
        }

        // If order status is changed to 'completed', reduce medicine stock
        if (request.status === 'completed') {
            await this.reduceMedicineStock(updatedOrder.items);
        }

        // Build response data for legacy format
        const responseData: any = {
            orderId: updatedOrder.orderId,
            status: updatedOrder.status as 'pending' | 'completed' | 'cancelled',
            items: updatedOrder.items,
            totalAmount: updatedOrder.totalAmount,
            updatedAt: updatedOrder.updatedAt.toISOString()
        };

        // Only include reason if it exists
        if (request.reason) {
            responseData.reason = request.reason;
        }

        // Return response
        return {
            success: true,
            message: 'Order status updated successfully',
            timestamp: new Date().toISOString(),
            data: responseData,
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

        // Validate medicines array if provided
        if (request.medicines && request.medicines.length > 0) {
            this.validateMedicineUpdates(request.medicines);
        }
    }

    private async handleIndividualMedicineUpdates(existingOrder: any, request: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
        // Validate medicine updates
        this.validateMedicineUpdates(request.medicines!);

        // Determine final order status based on medicine completion
        let finalStatus = request.status;
        if (request.status === 'completed') {
            finalStatus = this.determineFinalOrderStatus(request.medicines!);
        }

        // Update the order with individual medicine statuses
        const updatedOrder = await this.medicineOrderRepository.updateStatusWithIndividualMedicines(
            existingOrder.id,
            finalStatus,
            request.reason,
            request.medicines
        );

        if (!updatedOrder) {
            throw new AppError('Failed to update order status', 'UPDATE_FAILED', 500);
        }

        // If order status is changed to 'completed', reduce medicine stock for completed items
        if (finalStatus === 'completed') {
            const completedItems = updatedOrder.items.filter((item: any) => item.itemStatus === 'completed');
            await this.reduceMedicineStock(completedItems);
        }

        // Build response data
        const responseData: any = {
            orderId: updatedOrder.orderId,
            status: updatedOrder.status as 'pending' | 'completed' | 'cancelled',
            items: updatedOrder.items.map((item: any) => ({
                medicineId: item.medicineId ? item.medicineId.toString() : '',
                medicineName: item.medicineDetails?.name,
                quantity: item.quantity,
                price: item.price || 0,
                itemStatus: item.itemStatus || 'pending'
            })),
            totalAmount: updatedOrder.totalAmount,
            updatedAt: updatedOrder.updatedAt.toISOString()
        };

        // Only include reason if it exists
        if (updatedOrder.reason) {
            responseData.reason = updatedOrder.reason;
        }

        return {
            success: true,
            message: 'Order status updated successfully',
            timestamp: new Date().toISOString(),
            data: responseData,
        };
    }

    private validateMedicineUpdates(medicineUpdates: any[]): void {
        const validStatuses = ['completed', 'skipped'];
        
        for (const medicineUpdate of medicineUpdates) {
            if (!medicineUpdate.medicineId || !medicineUpdate.itemStatus) {
                throw new AppError('Each medicine update must have medicineId and itemStatus', 'INVALID_MEDICINE_UPDATE', 400);
            }

            if (!validStatuses.includes(medicineUpdate.itemStatus)) {
                throw new AppError('itemStatus must be either "completed" or "skipped"', 'INVALID_ITEM_STATUS', 400);
            }
        }
    }

    private determineFinalOrderStatus(medicineUpdates: any[]): 'pending' | 'completed' | 'cancelled' {
        const completedCount = medicineUpdates.filter(update => update.itemStatus === 'completed').length;
        const skippedCount = medicineUpdates.filter(update => update.itemStatus === 'skipped').length;

        if (skippedCount === medicineUpdates.length) {
            return 'cancelled'; // All medicines skipped
        } else if (completedCount > 0) {
            return 'completed'; // At least one medicine completed
        } else {
            return 'pending'; // No medicines completed or skipped
        }
    }
}