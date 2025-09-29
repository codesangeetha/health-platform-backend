// src/domain/use-cases/pharmacyAdmin/order-medicine.use-case.ts
import { AppError } from '@/shared/errors/app-error';
import { OrderMedicineRequest, OrderMedicineResponse } from '@/domain/types/pharmacyAdmin/order-medicine.type';
import { IOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/order-repository.interface';
import { IPrescriptionRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository.interface';
import { IMedicineRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository.interface';
import { IOrderMedicineUseCase } from '../interfaces/pharmacyAdmin/order-medicine.use-case.interface';
import { Order } from '@/domain/entities/order.entity';

export class OrderMedicineUseCase implements IOrderMedicineUseCase {
    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly prescriptionRepository: IPrescriptionRepository,
        private readonly medicineRepository: IMedicineRepository
    ) { }

    async execute(request: OrderMedicineRequest): Promise<OrderMedicineResponse> {
        // Validate input
        this.validateOrderRequest(request);

        // Check if prescription exists
        const prescription = await this.prescriptionRepository.findById(request.prescriptionId);
        if (!prescription) {
            throw new AppError('Prescription not found', 'PRESCRIPTION_NOT_FOUND', 404);
        }

        // Validate medicines and calculate total
        const { validatedItems, totalAmount } = await this.validateMedicinesAndCalculateTotal(request.items);

        // Generate order ID
        const orderId = this.generateOrderId();

        // Calculate estimated delivery date
        const estimatedDelivery = this.calculateEstimatedDelivery(request.deliveryMethod);

        // Generate payment URL
        const paymentUrl = this.generatePaymentUrl(orderId);

        // Prepare order data
        const orderData = {
            orderId,
            prescriptionId: request.prescriptionId,
            items: validatedItems,
            deliveryAddress: request.deliveryAddress,
            deliveryMethod: request.deliveryMethod,
            totalAmount,
            status: 'pending' as const,
            estimatedDelivery,
            paymentUrl,
            patientId: request.patientId, // This will be set by the controller from authenticated user
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const order = await this.orderRepository.create(orderData);

        return {
            success: true,
            message: 'Order placed successfully',
            timestamp: new Date().toISOString(),
            data: {
                orderId: order.orderId,
                totalAmount: order.totalAmount,
                status: order.status,
                estimatedDelivery: order.estimatedDelivery?.toISOString() || '',
                paymentUrl: order.paymentUrl || ''
            }
        };
    }

    private validateOrderRequest(request: OrderMedicineRequest): void {
        const requiredFields = ['prescriptionId', 'patientId', 'items', 'deliveryAddress', 'deliveryMethod'];
        for (const field of requiredFields) {
            if (!request[field as keyof typeof request]) {
                throw new AppError(`Missing required field: ${field}`, 'ORDER_001', 400);
            }
        }

        if (!Array.isArray(request.items) || request.items.length === 0) {
            throw new AppError('Items array cannot be empty', 'ORDER_002', 400);
        }

        // Validate delivery address
        const addressFields = ['street', 'city', 'state', 'zipCode', 'country'];
        for (const field of addressFields) {
            if (!request.deliveryAddress[field as keyof typeof request.deliveryAddress]) {
                throw new AppError(`Missing required delivery address field: ${field}`, 'ORDER_003', 400);
            }
        }

        // Validate delivery method
        const validDeliveryMethods = ['standard', 'express', 'urgent'];
        if (!validDeliveryMethods.includes(request.deliveryMethod)) {
            throw new AppError('Invalid delivery method', 'ORDER_004', 400);
        }
    }

    private async validateMedicinesAndCalculateTotal(items: OrderMedicineRequest['items']) {
        let totalAmount = 0;
        const validatedItems = [];

        for (const item of items) {
            if (!item.medicineId || !item.quantity || item.quantity <= 0) {
                throw new AppError('Invalid medicine item', 'ORDER_005', 400);
            }

            const medicine = await this.medicineRepository.findById(item.medicineId);
            if (!medicine) {
                throw new AppError(`Medicine not found: ${item.medicineId}`, 'ORDER_006', 404);
            }

            if (medicine.stock < item.quantity) {
                throw new AppError(`Insufficient stock for medicine: ${medicine.name}`, 'ORDER_007', 400);
            }

            const itemTotal = medicine.price * item.quantity;
            totalAmount += itemTotal;

            validatedItems.push({
                medicineId: item.medicineId,
                quantity: item.quantity,
                price: medicine.price
            });
        }

        return { validatedItems, totalAmount };
    }

    private generateOrderId(): string {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ORD_${timestamp}_${randomSuffix}`;
    }

    private calculateEstimatedDelivery(deliveryMethod: string): Date {
        const now = new Date();
        let daysToAdd = 7; // Default: standard delivery

        switch (deliveryMethod) {
            case 'express':
                daysToAdd = 3;
                break;
            case 'urgent':
                daysToAdd = 1;
                break;
            case 'standard':
            default:
                daysToAdd = 7;
                break;
        }

        const estimatedDate = new Date(now);
        estimatedDate.setDate(now.getDate() + daysToAdd);
        return estimatedDate;
    }

    private generatePaymentUrl(orderId: string): string {
        // In a real application, this would integrate with a payment gateway
        return `https://payment.healthplatform.com/pay/${orderId}`;
    }
}