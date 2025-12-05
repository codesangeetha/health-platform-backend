// src/domain/use-cases/pharmacyAdmin/get-pharmacy-order-by-id.use-case.ts
import { AppError } from '@/shared/errors/app-error';
import { GetPharmacyOrderByIdRequest, GetPharmacyOrderByIdResponse } from '@/domain/types/pharmacyAdmin/get-pharmacy-order-by-id.type';
import { IMedicineOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-order-repository.interface';
import { IGetPharmacyOrderByIdUseCase } from '../interfaces/pharmacyAdmin/get-pharmacy-order-by-id.use-case.interface';

export class GetPharmacyOrderByIdUseCase implements IGetPharmacyOrderByIdUseCase {
    constructor(
        private readonly orderRepository: IMedicineOrderRepository
    ) { }

    async execute(request: GetPharmacyOrderByIdRequest): Promise<GetPharmacyOrderByIdResponse> {
        console.log('🔍 GET_PHARMACY_ORDER_BY_ID_USE_CASE: Starting execution');
        console.log('🔍 GET_PHARMACY_ORDER_BY_ID_USE_CASE: Request:', request);

        // Validate input
        this.validateRequest(request);

        // Fetch order from repository using orderId
        console.log('🔍 GET_PHARMACY_ORDER_BY_ID_USE_CASE: Calling repository with orderId:', request.orderId);
        const order = await this.orderRepository.findByOrderId(request.orderId);
        
        if (!order) {
            console.log('🔍 GET_PHARMACY_ORDER_BY_ID_USE_CASE: Order not found');
            throw new AppError('Pharmacy order not found', 'ORDER_NOT_FOUND', 404);
        }

        console.log('🔍 GET_PHARMACY_ORDER_BY_ID_USE_CASE: Repository returned order:', order.orderId);

        // Check if user is admin (pharmadmin or admin) - they can access any order
        const isAdmin = request.userType === 'pharmadmin' || request.userType === 'admin';
        
        // Verify the order belongs to the requesting user (security check) - skip for admin users
        if (!isAdmin && order.patientId && order.patientId !== request.userId && order.userId !== request.userId) {
            console.log('🔍 GET_PHARMACY_ORDER_BY_ID_USE_CASE: Order belongs to different user');
            throw new AppError('Unauthorized access to this order', 'UNAUTHORIZED', 403);
        }

        // Format the response
        const formattedOrder: any = {
            orderId: order.orderId,
            orderDate: order.createdAt.toISOString(),
            status: order.status,
            totalAmount: order.totalAmount,
            medicineItems: order.items.map(item => ({
                medicineName: item.medicineDetails?.name || 'Unknown Medicine',
                quantity: item.quantity,
                price: item.price || 0,
                medicineId: item.medicineId || '',
                itemStatus: item.itemStatus || 'pending',
                medicineDetails: item.medicineDetails ? {
                    _id: item.medicineDetails._id?.toString() || item.medicineId || '',
                    name: item.medicineDetails.name || '',
                    description: item.medicineDetails.description,
                    category: item.medicineDetails.category,
                    manufacturer: item.medicineDetails.manufacturer,
                    dosageForm: item.medicineDetails.dosageForm,
                    strength: item.medicineDetails.strength,
                    price: item.medicineDetails.price
                } : undefined
            })),
            deliveryMethod: order.deliveryMethod,
            ...(order.deliveryAddress && {
                deliveryAddress: {
                    street: order.deliveryAddress.street,
                    city: order.deliveryAddress.city,
                    state: order.deliveryAddress.state,
                    zipCode: order.deliveryAddress.zipCode,
                    country: order.deliveryAddress.country
                }
            }),
            ...(order.estimatedDelivery && { estimatedDelivery: order.estimatedDelivery.toISOString() }),
            ...(order.trackingNumber && { trackingNumber: order.trackingNumber }),
            ...(order.prescriptionId && { prescriptionId: order.prescriptionId }),
            ...(order.reason && { reason: order.reason }),
            // Completed date if order is delivered
            ...(order.status === 'delivered' && { completedDate: order.updatedAt.toISOString() })
        };

        console.log('🔍 GET_PHARMACY_ORDER_BY_ID_USE_CASE: Formatted order response');

        return {
            success: true,
            message: 'Pharmacy order retrieved successfully',
            timestamp: new Date().toISOString(),
            data: {
                order: formattedOrder
            }
        };
    }

    private validateRequest(request: GetPharmacyOrderByIdRequest): void {
        if (!request.orderId) {
            throw new AppError('Order ID is required', 'ORDER_ID_REQUIRED', 400);
        }

        if (!request.userId) {
            throw new AppError('User ID is required', 'USER_ID_REQUIRED', 400);
        }

        // Basic orderId format validation
        if (request.orderId.trim().length === 0) {
            throw new AppError('Order ID cannot be empty', 'INVALID_ORDER_ID', 400);
        }
    }
}
