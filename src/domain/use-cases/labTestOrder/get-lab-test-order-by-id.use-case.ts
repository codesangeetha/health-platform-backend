// src/domain/use-cases/labTestOrder/get-lab-test-order-by-id.use-case.ts
import { AppError } from '@/shared/errors/app-error';
import { GetLabTestOrderByIdRequest, GetLabTestOrderByIdResponse } from '@/domain/types/labTestOrder/get-lab-test-order-by-id.type';
import { ILabTestOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.interface';
import { IGetLabTestOrderByIdUseCase } from '../interfaces/labTestOrder/get-lab-test-order-by-id.use-case.interface';

export class GetLabTestOrderByIdUseCase implements IGetLabTestOrderByIdUseCase {
    constructor(
        private readonly orderRepository: ILabTestOrderRepository
    ) { }

    async execute(request: GetLabTestOrderByIdRequest): Promise<GetLabTestOrderByIdResponse> {
        console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_USE_CASE: Starting execution');
        console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_USE_CASE: Request:', request);

        // Validate input
        this.validateRequest(request);

        // Fetch order from repository using orderId
        console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_USE_CASE: Calling repository with orderId:', request.orderId);
        const order = await this.orderRepository.findByOrderId(request.orderId);
        
        if (!order) {
            console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_USE_CASE: Order not found');
            throw new AppError('Lab test order not found', 'ORDER_NOT_FOUND', 404);
        }

        console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_USE_CASE: Repository returned order:', order.orderId);

        // Verify the order belongs to the requesting user (security check)
        if (order.userId && order.userId !== request.userId) {
            console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_USE_CASE: Order belongs to different user');
            throw new AppError('Unauthorized access to this order', 'UNAUTHORIZED', 403);
        }

        // Format the response
        const formattedOrder = {
            orderId: order.orderId,
            orderDate: order.createdAt.toISOString(),
            status: order.status,
            totalAmount: order.totalAmount,
            testItems: order.items.map(item => ({
                testName: item.labTestDetails?.name || item.labTestName || 'Unknown Test',
                price: item.price || 0,
                labTestId: item.labTestId,
                testStatus: item.testStatus || 'pending',
                result: item.result || null,
                labTestDetails: item.labTestDetails || undefined
            })),
            collectionMethod: order.collectionMethod,
            ...(order.scheduledDate && { scheduledDate: order.scheduledDate.toISOString() }),
            ...(order.collectionAddress && {
                collectionAddress: {
                    street: order.collectionAddress.street,
                    city: order.collectionAddress.city,
                    state: order.collectionAddress.state,
                    postalCode: order.collectionAddress.zipCode
                }
            }),
            ...(order.trackingNumber && { trackingNumber: order.trackingNumber }),
            ...(order.prescriptionId && { prescriptionId: order.prescriptionId }),
            ...(order.reason && { reason: order.reason }),
            // Additional information that might be useful
            ...(order.userId && { patientId: order.userId }),
            // Results information if available
            ...(order.status === 'completed' && this.extractResultsInfo(order))
        };

        console.log('🔍 GET_LAB_TEST_ORDER_BY_ID_USE_CASE: Formatted order response');

        return {
            success: true,
            message: 'Lab test order retrieved successfully',
            timestamp: new Date().toISOString(),
            data: {
                order: formattedOrder
            }
        };
    }

    private validateRequest(request: GetLabTestOrderByIdRequest): void {
        if (!request.orderId) {
            throw new AppError('Order ID is required', 'ORDER_ID_REQUIRED', 400);
        }

        if (!request.userId) {
            throw new AppError('User ID is required', 'USER_ID_REQUIRED', 400);
        }

        // Basic orderId format validation (MongoDB ObjectId or custom format)
        if (request.orderId.trim().length === 0) {
            throw new AppError('Order ID cannot be empty', 'INVALID_ORDER_ID', 400);
        }
    }

    private extractResultsInfo(order: any): any {
        const resultsInfo: any = {};
        
        // Check if any items have results
        const itemsWithResults = order.items.filter((item: any) => item.result);
        
        if (itemsWithResults.length > 0) {
            resultsInfo.resultData = {};
            itemsWithResults.forEach((item: any) => {
                const testName = item.labTestDetails?.name || item.labTestName || 'Unknown Test';
                resultsInfo.resultData[testName] = item.result;
            });
        }

        // Check if order is completed (might have completion date)
        if (order.status === 'completed') {
            resultsInfo.completedDate = order.updatedAt.toISOString();
        }

        // Return empty object if no results found
        return Object.keys(resultsInfo).length > 0 ? resultsInfo : {};
    }
}