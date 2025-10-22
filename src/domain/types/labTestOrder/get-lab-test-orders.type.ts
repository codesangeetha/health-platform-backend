export interface GetLabTestOrdersRequest {
  status?: 'pending' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
  page?: number;
  limit?: number;
  startDate?: string; // ISO date string for date range filtering
  endDate?: string; // ISO date string for date range filtering
  userId: string; // This will come from the authenticated user
}

export interface LabTestOrderItemResponse {
  testName: string;
  price: number;
}

export interface LabTestOrderResponse {
  orderId: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  testItems: LabTestOrderItemResponse[];
  collectionMethod: string;
  scheduledDate?: string;
  collectionAddress?: {
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

export interface GetLabTestOrdersResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    orders: LabTestOrderResponse[];
    pagination: PaginationInfo;
  };
}