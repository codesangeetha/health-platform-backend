// src/domain/use-cases/pharmacyAdmin/get-all-orders.use-case.ts
import { AppError } from '@/shared/errors/app-error';
import { GetAllOrdersRequest, GetAllOrdersResponse, OrderResponse } from '@/domain/types/pharmacyAdmin/get-all-orders.type';
import { IMedicineOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-order-repository.interface';
import { ILabTestOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.interface';
import { IPatientRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient-repository.interface';
import { IPrescriptionRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository.interface';
import { IGetAllOrdersUseCase } from '../interfaces/pharmacyAdmin/get-all-orders.use-case.interface';

export class GetAllOrdersUseCase implements IGetAllOrdersUseCase {
    constructor(
        private readonly medicineOrderRepository: IMedicineOrderRepository,
        private readonly labTestOrderRepository: ILabTestOrderRepository,
        private readonly patientRepository: IPatientRepository,
        private readonly prescriptionRepository: IPrescriptionRepository
    ) { }

    async execute(request: GetAllOrdersRequest): Promise<GetAllOrdersResponse> {
        // Validate input
        this.validateRequest(request);

        // Set default values
        const page = request.page || 1;
        const limit = request.limit || 10;

        // Get orders from both repositories
        let orders: any[] = [];
        let total = 0;

        // Get medicine orders
        if (request.orderType === 'medicine' || !request.orderType) {
            const medicineResult = await this.medicineOrderRepository.findAll(
                page,
                limit,
                request.status,
                request.patientId
            );
            orders = orders.concat(medicineResult.orders);
            total += medicineResult.total;
        }

        // Get lab test orders
        if (request.orderType === 'lab_test' || !request.orderType) {
            const labTestResult = await this.labTestOrderRepository.findAll(
                page,
                limit,
                request.status,
                request.patientId
            );
            orders = orders.concat(labTestResult.orders);
            total += labTestResult.total;
        }

        // Apply client-side filtering for date range if provided
        let filteredOrders = orders;
        if (request.dateFrom || request.dateTo) {
            const fromDate = request.dateFrom ? new Date(request.dateFrom!) : new Date('1900-01-01');
            const toDate = request.dateTo ? new Date(request.dateTo!) : new Date('2100-12-31');
            
            // Set time to start of day for fromDate and end of day for toDate
            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(23, 59, 59, 999);
            
            filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= fromDate && orderDate <= toDate;
            });
            total = filteredOrders.length;
        }

        // Apply amount range filtering if provided
        if (request.amountMin !== undefined || request.amountMax !== undefined) {
            filteredOrders = filteredOrders.filter(order => {
                const orderAmount = order.totalAmount || 0;
                const minAmount = request.amountMin ?? 0;
                const maxAmount = request.amountMax ?? Number.MAX_VALUE;
                return orderAmount >= minAmount && orderAmount <= maxAmount;
            });
            total = filteredOrders.length;
        }

        // Apply patient name filtering if provided
        if (request.patientName) {
            // First convert orders to response format to get patient names
            const ordersWithPatientNames = await Promise.all(
                filteredOrders.map(order => this.mapOrderToResponse(order))
            );
            
            // Filter by patient name (case-insensitive partial match)
            const nameFilteredOrders = ordersWithPatientNames.filter(order =>
                order.patientName.toLowerCase().includes(request.patientName!.toLowerCase())
            );
            
            // Create a set of order IDs that match the name filter for efficient lookup
            const matchingOrderIds = new Set(nameFilteredOrders.map(order => order.orderId));
            
            // Update filtered orders and total
            filteredOrders = filteredOrders.filter(order =>
                matchingOrderIds.has(order.orderId || '')
            );
            total = filteredOrders.length;
        }

        // Convert to response format with patient information
        const ordersResponse = await Promise.all(
            filteredOrders.map(order => this.mapOrderToResponse(order))
        );

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

    private validateRequest(request: GetAllOrdersRequest): void {
        // Validate status if provided
        if (request.status) {
            const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'sample_collected', 'in_progress', 'completed'];
            if (!validStatuses.includes(request.status)) {
                throw new AppError('Invalid status value', 'INVALID_STATUS', 400);
            }
        }

        // Validate order type if provided
        if (request.orderType) {
            const validOrderTypes = ['medicine', 'lab_test'];
            if (!validOrderTypes.includes(request.orderType)) {
                throw new AppError('Invalid order type value', 'INVALID_ORDER_TYPE', 400);
            }
        }

        // Validate pagination parameters
        if (request.page && request.page < 1) {
            throw new AppError('Page must be greater than 0', 'INVALID_PAGE', 400);
        }

        if (request.limit && (request.limit < 1 || request.limit > 100)) {
            throw new AppError('Limit must be between 1 and 100', 'INVALID_LIMIT', 400);
        }

        // Validate dateFrom and dateTo format if provided
        if (request.dateFrom) {
            const date = new Date(request.dateFrom);
            if (isNaN(date.getTime())) {
                throw new AppError('Invalid dateFrom format. Use YYYY-MM-DD', 'INVALID_DATE_FROM_FORMAT', 400);
            }
        }

        if (request.dateTo) {
            const date = new Date(request.dateTo);
            if (isNaN(date.getTime())) {
                throw new AppError('Invalid dateTo format. Use YYYY-MM-DD', 'INVALID_DATE_TO_FORMAT', 400);
            }
        }

        // Validate date range if both provided
        if (request.dateFrom && request.dateTo) {
            const fromDate = new Date(request.dateFrom);
            const toDate = new Date(request.dateTo);
            if (fromDate > toDate) {
                throw new AppError('dateFrom cannot be greater than dateTo', 'INVALID_DATE_RANGE', 400);
            }
        }

        // Validate amount parameters if provided
        if (request.amountMin !== undefined && request.amountMin < 0) {
            throw new AppError('amountMin must be greater than or equal to 0', 'INVALID_AMOUNT_MIN', 400);
        }

        if (request.amountMax !== undefined && request.amountMax < 0) {
            throw new AppError('amountMax must be greater than or equal to 0', 'INVALID_AMOUNT_MAX', 400);
        }

        if (request.amountMin !== undefined && request.amountMax !== undefined && request.amountMin > request.amountMax) {
            throw new AppError('amountMin cannot be greater than amountMax', 'INVALID_AMOUNT_RANGE', 400);
        }

        // Validate patientName if provided
        if (request.patientName && request.patientName.trim().length === 0) {
            throw new AppError('patientName cannot be empty', 'INVALID_PATIENT_NAME', 400);
        }
    }

    private async mapOrderToResponse(order: any): Promise<OrderResponse> {
        // Handle prescriptionId - extract ID if it's a populated object or MongoDB ObjectId format
        let prescriptionId: string | undefined;


        if (order.prescriptionId) {
            if (typeof order.prescriptionId === 'object' && order.prescriptionId._id) {
                // Handle populated object
                prescriptionId = order.prescriptionId._id.toString();
            } else if (typeof order.prescriptionId === 'object' && order.prescriptionId.$oid) {
                // Handle MongoDB ObjectId format: {"$oid": "68ef6f3e0e5eee2399aecee9"}
                prescriptionId = order.prescriptionId.$oid;
            } else if (typeof order.prescriptionId === 'string') {
                prescriptionId = order.prescriptionId;
            } else if (typeof order.prescriptionId === 'object' && order.prescriptionId.constructor) {
                // Handle MongoDB ObjectId objects properly
                try {
                    // For MongoDB ObjectId, use the _id value or convert properly
                    if (order.prescriptionId._bsontype === 'ObjectId' || order.prescriptionId.constructor.name === 'ObjectId') {
                        prescriptionId = order.prescriptionId.toHexString ? order.prescriptionId.toHexString() : order.prescriptionId.toString();
                    } else {
                        prescriptionId = String(order.prescriptionId);
                    }
                } catch (error) {
                    console.error('Error converting prescriptionId to string:', error);
                    prescriptionId = String(order.prescriptionId);
                }
            } else {
                prescriptionId = String(order.prescriptionId);
            }
        }

        // Get prescription to extract correct patientId
        let correctPatientId = order.userId || order.patientId || order.customerId;
        if (prescriptionId) {
            try {
                const prescription = await this.prescriptionRepository.findById(prescriptionId);
                if (prescription) {
                    correctPatientId = prescription.patientId;
                    console.log('Found correct patientId from prescription:', correctPatientId);
                }
            } catch (error) {
                console.error('Error fetching prescription:', error);
            }
        }

        // Get patient information using the correct patientId from prescription
        const patient = await this.patientRepository.findById(correctPatientId);
        console.log('Patient lookup result:', {
            correctPatientId: correctPatientId,
            patientFound: !!patient,
            patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Not found'
        });

        // Debug logging
        console.log('Order data:', {
            orderId: order.orderId,
            userId: order.userId,
            prescriptionId: prescriptionId,
            patientId: order.patientId,
            status: order.status,
            orderType: order.orderType
        });

        // Additional logging for patient lookup
        console.log('Looking up patient with ID:', order.userId);

        const response: OrderResponse = {
            orderId: order.orderId || '',
            patientId: correctPatientId || '',
            patientName: patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown Patient' : 'Unknown Patient',
            orderType: order.orderType || 'medicine',
            orderDate: order.createdAt ? order.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: order.status || 'pending',
            totalAmount: order.totalAmount || 0,
            items: order.items ? order.items.map((item: any) => ({
                medicineName: item.medicineDetails?.name || '',
                labTestName: item.labTestDetails?.name || '',
                labTestId: item.labTestId || item.labTestDetails?._id || '',
                quantity: item.quantity || 0,
                price: item.price || 0
            })) : [],
            deliveryAddress: {
                street: order.deliveryAddress?.street || '',
                city: order.deliveryAddress?.city || '',
                state: order.deliveryAddress?.state || ''
            },
            trackingNumber: order.trackingNumber,
            createdAt: order.createdAt ? order.createdAt.toISOString() : new Date().toISOString()
        };

        // Add prescriptionId only if it exists
        if (prescriptionId) {
            response.prescriptionId = prescriptionId;
        }

        return response;
    }
}