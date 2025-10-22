// src/domain/use-cases/labTestOrder/order-lab-test.use-case.ts
import { AppError } from '@/shared/errors/app-error';
import { OrderLabTestRequest, OrderLabTestResponse } from '@/domain/types/labTestOrder/order-lab-test.type';
import { ILabTestOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.interface';
import { ILabTestRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTest-repository.interface';
import { IPrescriptionRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository.interface';
import { IOrderLabTestUseCase } from '../interfaces/labTestOrder/order-lab-test.use-case.interface';
import { LabTestOrder } from '@/domain/entities/labTestOrder.entity';

export class OrderLabTestUseCase implements IOrderLabTestUseCase {
    constructor(
        private readonly orderRepository: ILabTestOrderRepository,
        private readonly labTestRepository: ILabTestRepository,
        private readonly prescriptionRepository: IPrescriptionRepository
    ) { }

    async execute(request: OrderLabTestRequest): Promise<OrderLabTestResponse> {
        // Validate input
        this.validateOrderRequest(request);

        
        // Fetch prescription to get patientId
        if (!request.prescriptionId) {
            throw new AppError('Prescription ID is required', 'PRESCRIPTION_ID_REQUIRED', 400);
        }

        const prescription = await this.prescriptionRepository.findById(request.prescriptionId);
        if (!prescription) {
            throw new AppError('Prescription not found', 'PRESCRIPTION_NOT_FOUND', 404);
        }

        // Validate lab tests and calculate total
        const { validatedItems, totalAmount } = await this.validateLabTestsAndCalculateTotal(request.testItems);

        // Generate order ID
        const orderId = this.generateOrderId();

        // Calculate estimated collection date
        const estimatedCollection = this.calculateEstimatedCollection(request.collectionMethod);

        // Prepare order data
        const orderData = {
            orderId,
            orderType: 'lab_test' as const,
            prescriptionId: request.prescriptionId,
            items: validatedItems,
            deliveryAddress: request.deliveryAddress,
            collectionMethod: request.collectionMethod,
            totalAmount,
            status: 'pending' as const,
            scheduledDate: request.scheduledDate ? new Date(request.scheduledDate) : undefined,
            collectionAddress: request.collectionAddress,
            patientId: prescription.patientId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const order = await this.orderRepository.create(orderData);

        return {
            success: true,
            message: 'Lab test order placed successfully',
            timestamp: new Date().toISOString(),
            data: {
                orderId: order.orderId,
                totalAmount: order.totalAmount,
                status: order.status,
                ...(order.scheduledDate && { scheduledDate: order.scheduledDate.toISOString() }),
                estimatedCollection: order.scheduledDate?.toISOString() || estimatedCollection.toISOString()
            }
        };
    }

    private validateOrderRequest(request: OrderLabTestRequest): void {
        const requiredFields = ['testItems', 'deliveryAddress', 'collectionMethod'];
        for (const field of requiredFields) {
            if (!request[field as keyof typeof request]) {
                throw new AppError(`Missing required field: ${field}`, 'LAB_ORDER_001', 400);
            }
        }

        if (!Array.isArray(request.testItems) || request.testItems.length === 0) {
            throw new AppError('Test items array cannot be empty', 'LAB_ORDER_002', 400);
        }

        // Validate delivery address
        const addressFields = ['street', 'city', 'state', 'zipCode', 'country'];
        for (const field of addressFields) {
            if (!request.deliveryAddress[field as keyof typeof request.deliveryAddress]) {
                throw new AppError(`Missing required delivery address field: ${field}`, 'LAB_ORDER_003', 400);
            }
        }

        // Validate collection method
        const validCollectionMethods = ['home_collection', 'lab_visit'];
        if (!validCollectionMethods.includes(request.collectionMethod)) {
            throw new AppError('Invalid collection method', 'LAB_ORDER_004', 400);
        }

        // Validate scheduled date if provided
        if (request.scheduledDate) {
            const scheduledDate = new Date(request.scheduledDate);
            const now = new Date();
            if (scheduledDate <= now) {
                throw new AppError('Scheduled date must be in the future', 'LAB_ORDER_005', 400);
            }
        }
    }

    private async validateLabTestsAndCalculateTotal(testItems: OrderLabTestRequest['testItems']) {
        let totalAmount = 0;
        const validatedItems = [];

        for (const item of testItems) {
            if (!item.testId) {
                throw new AppError('Invalid lab test item', 'LAB_ORDER_006', 400);
            }

            const labTest = await this.labTestRepository.findById(item.testId);
            if (!labTest) {
                throw new AppError(`Lab test not found: ${item.testId}`, 'LAB_ORDER_007', 404);
            }

            if (!labTest.isActive) {
                throw new AppError(`Lab test is not available: ${labTest.name}`, 'LAB_ORDER_008', 400);
            }

            const itemPrice = labTest.price || 0;
            totalAmount += itemPrice;

            validatedItems.push({
                labTestId: item.testId,
                quantity: 1,
                price: itemPrice
            });
        }

        return { validatedItems, totalAmount };
    }

    private generateOrderId(): string {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `LAB_${timestamp}_${randomSuffix}`;
    }

    private calculateEstimatedCollection(collectionMethod: string): Date {
        const now = new Date();
        let hoursToAdd = 24; // Default: 24 hours for lab visit

        switch (collectionMethod) {
            case 'home_collection':
                hoursToAdd = 48; // 48 hours for home collection
                break;
            case 'lab_visit':
            default:
                hoursToAdd = 24; // 24 hours for lab visit
                break;
        }

        const estimatedDate = new Date(now);
        estimatedDate.setHours(now.getHours() + hoursToAdd);
        return estimatedDate;
    }

}