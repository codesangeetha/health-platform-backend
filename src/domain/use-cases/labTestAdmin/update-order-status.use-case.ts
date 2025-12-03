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

        // Process results based on format
        let processedResult = request.result;
        if (Array.isArray(request.result)) {
            // Validate and process array format
            this.validateResultArray(request.result, existingOrder.items);
            processedResult = this.processResultArray(request.result, existingOrder.items);
        }

        // Update the order status, reason, and result using the MongoDB ObjectId
        const updatedOrder = await this.labTestOrderRepository.updateStatusReasonAndResults(
            existingOrder.id, 
            request.status, 
            request.reason,
            processedResult
        );

        if (!updatedOrder) {
            throw new AppError('Failed to update order status', 'UPDATE_FAILED', 500);
        }

        // Build response data - always include result field when present in request
        const responseData: any = {
            orderId: updatedOrder.orderId,
            status: updatedOrder.status as 'pending' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled',
            reason: updatedOrder.reason,
            updatedAt: updatedOrder.updatedAt.toISOString()
        };

        // Include result if it was provided in the request
        if (request.result !== undefined) {
            responseData.result = request.result;
        }

        // Return response
        return {
            success: true,
            message: 'Lab test order status updated successfully',
            timestamp: new Date().toISOString(),
            data: responseData,
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

    private validateResultArray(resultArray: any[], orderItems: any[]): void {
        if (!Array.isArray(resultArray)) {
            throw new AppError('Result must be an array when using array format', 'INVALID_RESULT_FORMAT', 400);
        }

        const validLabTestIds = orderItems.map(item => item.labTestId.toString());
        
        for (const resultItem of resultArray) {
            if (!resultItem.labTestId || !resultItem.testResult) {
                throw new AppError('Each result item must have labTestId and testResult', 'INVALID_RESULT_ITEM', 400);
            }

            if (!validLabTestIds.includes(resultItem.labTestId)) {
                throw new AppError(`labTestId ${resultItem.labTestId} not found in order items`, 'INVALID_LABTEST_ID', 400);
            }
        }
    }

    private processResultArray(resultArray: any[], orderItems: any[]): any {
        // Create a map of labTestId to updated result for quick lookup
        const resultMap = new Map();
        for (const resultItem of resultArray) {
            resultMap.set(resultItem.labTestId, resultItem.testResult);
        }

        // Update the order items with the new results
        const updatedItems = orderItems.map(item => {
            const labTestId = item.labTestId.toString();
            if (resultMap.has(labTestId)) {
                return {
                    ...item,
                    result: resultMap.get(labTestId)
                };
            }
            return item;
        });

        return updatedItems;
    }
}