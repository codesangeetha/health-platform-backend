// Request type for updating pharmacy order status
export interface UpdateOrderStatusRequest {
  status: 'pending' | 'completed' | 'cancelled';
  reason?: string;
}

// Response type for updating pharmacy order status
export interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    orderId: string;
    status: 'pending' | 'completed' | 'cancelled';
    reason: string | undefined;
    updatedAt: string;
  };
}