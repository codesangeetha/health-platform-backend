export interface GetPatientOrdersRequest {
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  page?: number;
  limit?: number;
  userId: string; // This will come from the authenticated user
}

export interface OrderItemResponse {
  medicineName: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  orderId: string;
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
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetPatientOrdersResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    orders: OrderResponse[];
    pagination: PaginationInfo;
  };
}