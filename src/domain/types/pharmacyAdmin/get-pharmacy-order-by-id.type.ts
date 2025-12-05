export interface GetPharmacyOrderByIdRequest {
  orderId: string;
  userId: string; // This will come from the authenticated user
  userType?: string; // User type to check for admin access
}

export interface GetPharmacyOrderByIdResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    order: {
      orderId: string;
      orderDate: string;
      status: string;
      totalAmount: number;
      medicineItems: {
        medicineName: string;
        quantity: number;
        price: number;
        medicineId?: string;
        itemStatus: string;
        medicineDetails?: {
          _id: string;
          name: string;
          description?: string;
          category?: string;
          manufacturer?: string;
          dosageForm?: string;
          strength?: string;
          price?: number;
        };
      }[];
      deliveryMethod: string;
      deliveryAddress?: {
        street: string;
        city: string;
        state: string;
        zipCode?: string;
        country?: string;
      };
      estimatedDelivery?: string;
      trackingNumber?: string;
      prescriptionId?: string;
      reason?: string;
      completedDate?: string;
    };
  };
}
