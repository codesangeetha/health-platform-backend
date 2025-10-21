export interface GetAllOrdersRequest {
    patientId?: string;
    status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'sample_collected' | 'in_progress' | 'completed';
    createdDate?: string; // ISO date string format (YYYY-MM-DD)
    orderType?: 'medicine' | 'lab_test';
    page?: number;
    limit?: number;
}

export interface OrderItemResponse {
    medicineName?: string;
    labTestName?: string;
    quantity: number;
    price: number;
}

export interface OrderResponse {
    orderId: string;
    patientId: string;
    patientName: string;
    prescriptionId?: string;
    orderType: 'medicine' | 'lab_test';
    orderDate: string;
    status: string;
    totalAmount: number;
    items: OrderItemResponse[];
    deliveryAddress: {
        street: string;
        city: string;
        state: string;
    };
    trackingNumber?: string;
    createdAt: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface GetAllOrdersResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: {
        orders: OrderResponse[];
        pagination: PaginationInfo;
    };
}