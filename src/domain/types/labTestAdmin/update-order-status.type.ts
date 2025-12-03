// Lab test result item with labTestId mapping
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
    updatedAt: string;
  };
}