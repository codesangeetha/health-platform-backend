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

        // Handle new individual test status format
        if (request.tests && request.tests.length > 0) {
            return this.handleIndividualTestUpdates(existingOrder, request);
        }

        // Check if result array contains testStatus fields (new format using result field)
        if (Array.isArray(request.result) && request.result.length > 0 && (request.result[0] as any).testStatus) {
            // Convert result array to tests format for processing
            const testsFromResult = request.result.map((item: any) => ({
                labTestId: item.labTestId,
                testStatus: item.testStatus,
                testResult: item.testResult
            }));
            
            const convertedRequest = {
                ...request,
                tests: testsFromResult
            };
            return this.handleIndividualTestUpdates(existingOrder, convertedRequest);
        }

        // Handle legacy formats (result-based updates)
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
            items: updatedOrder.items,
            totalAmount: updatedOrder.totalAmount,
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

    private async handleIndividualTestUpdates(existingOrder: any, request: UpdateLabTestOrderStatusRequest): Promise<UpdateLabTestOrderStatusResponse> {
        // Validate test updates
        this.validateTestUpdates(request.tests!, existingOrder.items);

        // Determine final order status based on test completion
        let finalStatus = request.status;
        if (request.status === 'completed') {
            finalStatus = this.determineFinalOrderStatus(request.tests!);
        }

        // Update the order with individual test statuses
        const updatedOrder = await this.labTestOrderRepository.updateStatusWithIndividualTests(
            existingOrder.id,
            finalStatus,
            request.reason,
            request.tests
        );

        if (!updatedOrder) {
            throw new AppError('Failed to update order status', 'UPDATE_FAILED', 500);
        }

        // Build response data
        const responseData: any = {
            orderId: updatedOrder.orderId,
            status: updatedOrder.status as 'pending' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled',
            items: updatedOrder.items.map((item: any) => {
                let result = item.result || undefined;
                // Normalize "skipped" result to null for consistency
                if (result === 'skipped') {
                    result = null;
                }
                
                // Ensure testStatus is properly set - it should be 'completed' or 'skipped' from individual test updates
                const testStatus = item.testStatus || 'pending';
                
                return {
                    labTestId: item.labTestId ? item.labTestId.toString() : '',
                    labTestName: item.labTestName,
                    quantity: item.quantity,
                    price: item.price || 0,
                    result: result,
                    testStatus: testStatus
                };
            }),
            totalAmount: updatedOrder.totalAmount,
            updatedAt: updatedOrder.updatedAt.toISOString()
        };

        // Only include reason if it exists
        if (updatedOrder.reason) {
            responseData.reason = updatedOrder.reason;
        }

        return {
            success: true,
            message: 'Lab test order status updated successfully',
            timestamp: new Date().toISOString(),
            data: responseData,
        };
    }

    private validateTestUpdates(testUpdates: any[], orderItems: any[]): void {
        const validLabTestIds = orderItems.map(item => item.labTestId.toString());
        
        for (const testUpdate of testUpdates) {
            if (!testUpdate.labTestId || !testUpdate.testStatus) {
                throw new AppError('Each test update must have labTestId and testStatus', 'INVALID_TEST_UPDATE', 400);
            }

            if (!['completed', 'skipped'].includes(testUpdate.testStatus)) {
                throw new AppError('testStatus must be either "completed" or "skipped"', 'INVALID_TEST_STATUS', 400);
            }

            if (!validLabTestIds.includes(testUpdate.labTestId)) {
                throw new AppError(`labTestId ${testUpdate.labTestId} not found in order items`, 'INVALID_LABTEST_ID', 400);
            }

            // If testStatus is 'completed', testResult is required
            if (testUpdate.testStatus === 'completed' && !testUpdate.testResult) {
                throw new AppError('testResult is required when testStatus is "completed"', 'MISSING_TEST_RESULT', 400);
            }

            // If testStatus is 'skipped', testResult should be null or "skipped"
            if (testUpdate.testStatus === 'skipped' && testUpdate.testResult && testUpdate.testResult !== 'skipped') {
                throw new AppError('testResult should be null or "skipped" when testStatus is "skipped"', 'INVALID_TEST_RESULT_FOR_SKIPPED', 400);
            }
        }
    }

    private determineFinalOrderStatus(testUpdates: any[]): 'pending' | 'completed' | 'cancelled' {
        const completedCount = testUpdates.filter(update => update.testStatus === 'completed').length;
        const skippedCount = testUpdates.filter(update => update.testStatus === 'skipped').length;

        if (skippedCount === testUpdates.length) {
            return 'cancelled'; // All tests skipped
        } else if (completedCount > 0) {
            return 'completed'; // At least one test completed
        } else {
            return 'pending'; // No tests completed or skipped
        }
    }
}