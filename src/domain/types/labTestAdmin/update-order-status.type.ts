// Request type for updating lab test order status
export interface UpdateLabTestOrderStatusRequest {
  status: 'pending' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
  reason?: string;
}

// Response type for updating lab test order status
export interface UpdateLabTestOrderStatusResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    orderId: string;
    status: 'pending' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
    reason: string | undefined;
    updatedAt: string;
  };
}