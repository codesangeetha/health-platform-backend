// Individual medicine item with status
export interface MedicineStatusUpdateItem {
  medicineId: string;
  itemStatus: 'completed' | 'skipped';
}

// Request type for updating pharmacy order status
export interface UpdateOrderStatusRequest {
  status: 'pending' | 'completed' | 'cancelled';
  reason?: string;
  medicines?: MedicineStatusUpdateItem[]; // New format for individual medicine status updates
}

// Individual medicine item response
export interface MedicineOrderItemResponse {
  medicineId: string;
  medicineName?: string;
  quantity: number;
  price?: number;
  itemStatus: 'pending' | 'completed' | 'skipped';
}

// Response type for updating pharmacy order status
export interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    orderId: string;
    status: 'pending' | 'completed' | 'cancelled';
    reason?: string;
    items: MedicineOrderItemResponse[]; // Updated items with itemStatus
    totalAmount: number; // Recalculated total
    updatedAt: string;
  };
}