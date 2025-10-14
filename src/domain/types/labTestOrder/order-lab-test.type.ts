export interface OrderLabTestRequest {
  testItems: Array<{
    testId: string;
  }>;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  collectionMethod: 'home_collection' | 'lab_visit';
  scheduledDate?: string; // ISO date string
  collectionAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  prescriptionId: string; // ID of the prescription for this order
}

export interface OrderLabTestResponse {
   success: boolean;
   message: string;
   timestamp: string;
   data: {
     orderId: string;
     totalAmount: number;
     status: string;
     scheduledDate?: string;
     estimatedCollection: string;
   };
}