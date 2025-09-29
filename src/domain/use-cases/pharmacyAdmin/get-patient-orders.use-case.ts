// src/domain/use-cases/pharmacyAdmin/get-patient-orders.use-case.ts
import { AppError } from '@/shared/errors/app-error';
import { GetPatientOrdersRequest, GetPatientOrdersResponse, OrderResponse } from '@/domain/types/pharmacyAdmin/get-patient-orders.type';
import { IOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/order-repository.interface';
import { IGetPatientOrdersUseCase } from '../interfaces/pharmacyAdmin/get-patient-orders.use-case.interface';

export class GetPatientOrdersUseCase implements IGetPatientOrdersUseCase {
    constructor(
        private readonly orderRepository: IOrderRepository
    ) { }

    async execute(request: GetPatientOrdersRequest): Promise<GetPatientOrdersResponse> {
        // Validate input
        this.validateRequest(request);

        // Set default values
        const page = request.page || 1;
        const limit = request.limit || 10;

        // Get orders from repository
        const { orders, total } = await this.orderRepository.findPatientOrders(
            request.userId,
            request.status,
            page,
            limit
        );

        // Convert to response format
        const ordersResponse = orders.map(order => this.mapOrderToResponse(order));

        // Calculate pagination info
        const totalPages = Math.ceil(total / limit);

        return {
            success: true,
            message: 'Orders retrieved successfully',
            timestamp: new Date().toISOString(),
            data: {
                orders: ordersResponse,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages
                }
            }
        };
    }

    private validateRequest(request: GetPatientOrdersRequest): void {
        if (!request.userId) {
            throw new AppError('User ID is required', 'USER_ID_REQUIRED', 400);
        }

        // Validate status if provided
        if (request.status) {
            const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
            if (!validStatuses.includes(request.status)) {
                throw new AppError('Invalid status value', 'INVALID_STATUS', 400);
            }
        }

        // Validate pagination parameters
        if (request.page && request.page < 1) {
            throw new AppError('Page must be greater than 0', 'INVALID_PAGE', 400);
        }

        if (request.limit && (request.limit < 1 || request.limit > 100)) {
            throw new AppError('Limit must be between 1 and 100', 'INVALID_LIMIT', 400);
        }
    }

    private mapOrderToResponse(order: any): OrderResponse {
        return {
            orderId: order.orderId,
            orderDate: order.createdAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
            status: order.status,
            totalAmount: order.totalAmount,
            items: order.items.map((item: any) => ({
                medicineName: item.medicineId?.name || 'Unknown Medicine',
                quantity: item.quantity,
                price: item.price || 0
            })),
            deliveryAddress: {
                street: order.deliveryAddress.street,
                city: order.deliveryAddress.city,
                state: order.deliveryAddress.state
            },
            trackingNumber: order.trackingNumber
        };
    }
}