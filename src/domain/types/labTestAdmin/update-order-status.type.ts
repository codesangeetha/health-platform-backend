// Individual test item with status
export interface LabTestStatusUpdateItem {
  labTestId: string;
  testStatus: 'completed' | 'skipped';
  testResult?: string | null;
}

// Lab test result item with labTestId mapping (legacy format)
export interface LabTestResultItem {
  labTestId: string;
  testResult: string;
}

// Lab test result can be either a simple string (legacy) or array of objects (new format)
export type LabTestResult = string | LabTestResultItem[];

// Request type for updating lab test order status
export interface UpdateLabTestOrderStatusRequest {
  status: 'pending' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
  reason?: string;
  result?: LabTestResult;
  tests?: LabTestStatusUpdateItem[]; // New format for individual test status updates
}

// Individual test item response
export interface LabTestOrderItemResponse {
  labTestId: string;
  labTestName?: string;
  quantity: number;
  price?: number;
  result?: string | null;
  testStatus: 'pending' | 'completed' | 'skipped';
}

// Response type for updating lab test order status
export interface UpdateLabTestOrderStatusResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    orderId: string;
    status: 'pending' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
    reason?: string;
    result?: LabTestResult;
    items: LabTestOrderItemResponse[]; // Updated items with testStatus
    totalAmount: number; // Recalculated total
    updatedAt: string;
  };
}