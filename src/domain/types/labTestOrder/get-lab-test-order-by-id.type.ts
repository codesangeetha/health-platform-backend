export interface GetLabTestOrderByIdRequest {
  orderId: string;
  userId: string; // This will come from the authenticated user
}

export interface GetLabTestOrderByIdResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    order: {
      orderId: string;
      orderDate: string;
      status: string;
      totalAmount: number;
      testItems: {
        testName: string;
        price: number;
        labTestId?: string;
        labTestDetails?: {
          name: string;
          description?: string;
          category?: string;
        };
      }[];
      collectionMethod: string;
      scheduledDate?: string;
      collectionAddress?: {
        street: string;
        city: string;
        state: string;
        postalCode?: string;
      };
      trackingNumber?: string;
      patientInfo?: {
        name: string;
        email?: string;
        phone?: string;
      };
      doctorInfo?: {
        name: string;
        specialization?: string;
      };
      resultInfo?: {
        completedDate?: string;
        resultData?: any;
        reportUrl?: string;
      };
      paymentInfo?: {
        method: string;
        transactionId?: string;
        paidAmount: number;
      };
    };
  };
}