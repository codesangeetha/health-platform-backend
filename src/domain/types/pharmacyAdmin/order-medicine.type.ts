export interface OrderMedicineRequest {
  prescriptionId: string;
  patientId?: string; // Optional in request, will be set from authenticated user
  items: Array<{
    medicineId: string;
    quantity: number;
  }>;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  deliveryMethod: string;
}

export interface OrderMedicineResponse {
   success: boolean;
   message: string;
   timestamp: string;
   data: {
     orderId: string;
     totalAmount: number;
     status: string;
     estimatedDelivery: string;
   };
}