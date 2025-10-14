// src/domain/use-cases/labTestOrder/get-lab-test-orders.use-case.ts
import { AppError } from '@/shared/errors/app-error';
import { GetLabTestOrdersRequest, GetLabTestOrdersResponse } from '@/domain/types/labTestOrder/get-lab-test-orders.type';
import { ILabTestOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.interface';
import { IGetLabTestOrdersUseCase } from '../interfaces/labTestOrder/get-lab-test-orders.use-case.interface';

export class GetLabTestOrdersUseCase implements IGetLabTestOrdersUseCase {
    constructor(
        private readonly orderRepository: ILabTestOrderRepository
    ) { }

    async execute(request: GetLabTestOrdersRequest): Promise<GetLabTestOrdersResponse> {
        console.log('🔍 GET_LAB_TEST_ORDERS_USE_CASE: Starting execution');
        console.log('🔍 GET_LAB_TEST_ORDERS_USE_CASE: Request:', request);

        // Validate input
        this.validateRequest(request);

        // Parse pagination parameters
        const page = request.page || 1;
        const limit = request.limit || 10;

        console.log('🔍 GET_LAB_TEST_ORDERS_USE_CASE: Parsed pagination:', { page, limit });

        // Parse date range if provided
        let startDate: Date | undefined;
        let endDate: Date | undefined;

        if (request.startDate) {
            startDate = new Date(request.startDate);
            if (isNaN(startDate.getTime())) {
                throw new AppError('Invalid start date format', 'INVALID_DATE_FORMAT', 400);
            }
        }

        if (request.endDate) {
            endDate = new Date(request.endDate);
            if (isNaN(endDate.getTime())) {
                throw new AppError('Invalid end date format', 'INVALID_DATE_FORMAT', 400);
            }
        }

        // Validate date range
        if (startDate && endDate && startDate > endDate) {
            throw new AppError('Start date cannot be after end date', 'INVALID_DATE_RANGE', 400);
        }

        // Fetch orders from repository
        console.log('🔍 GET_LAB_TEST_ORDERS_USE_CASE: Calling repository with:', {
            userId: request.userId,
            status: request.status,
            page,
            limit,
            startDate,
            endDate
        });
        const { orders, total } = await this.orderRepository.findAll(
            page,
            limit,
            request.status,
            request.userId
        );
        console.log('🔍 GET_LAB_TEST_ORDERS_USE_CASE: Repository returned:', { ordersCount: orders.length, total });

        // Calculate pagination info
        const totalPages = Math.ceil(total / limit);

        // Format response
        const formattedOrders = orders.map(order => ({
            orderId: order.orderId,
            orderDate: order.createdAt.toISOString(),
            status: order.status,
            totalAmount: order.totalAmount,
            testItems: order.items.map(item => ({
                testName: item.labTestDetails?.name || 'Unknown Test',
                price: item.price || 0
            })),
            collectionMethod: order.collectionMethod,
            ...(order.scheduledDate && { scheduledDate: order.scheduledDate.toISOString() }),
            ...(order.collectionAddress && {
                collectionAddress: {
                    street: order.collectionAddress.street,
                    city: order.collectionAddress.city,
                    state: order.collectionAddress.state
                }
            }),
            ...(order.trackingNumber && { trackingNumber: order.trackingNumber })
        }));

        return {
            success: true,
            message: 'Lab test orders retrieved successfully',
            timestamp: new Date().toISOString(),
            data: {
                orders: formattedOrders,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages
                }
            }
        };
    }

    private validateRequest(request: GetLabTestOrdersRequest): void {
        if (!request.userId) {
            throw new AppError('User ID is required', 'USER_ID_REQUIRED', 400);
        }

        // Validate pagination parameters
        if (request.page !== undefined && (request.page < 1 || !Number.isInteger(request.page))) {
            throw new AppError('Page must be a positive integer', 'INVALID_PAGE', 400);
        }

        if (request.limit !== undefined && (request.limit < 1 || request.limit > 100 || !Number.isInteger(request.limit))) {
            throw new AppError('Limit must be an integer between 1 and 100', 'INVALID_LIMIT', 400);
        }

        // Validate status if provided
        if (request.status) {
            const validStatuses = ['pending', 'confirmed', 'sample_collected', 'processing', 'completed', 'cancelled'];
            if (!validStatuses.includes(request.status)) {
                throw new AppError('Invalid status filter', 'INVALID_STATUS', 400);
            }
        }
    }
}