// Request body type
export interface BookAppointmentRequest {
  doctorId: string;
  date: string; 
  time: string;
  isVideoCall:boolean;
  reason: string;
  symptoms: string;
}

// Response body type
export interface BookAppointmentResponse {
  success: boolean;
  message: string;
  timestamp: string; 
  data: {
    appointmentId: string;
    doctorId: string;
    patientId: string;
    date: string;
    time: string;
    status: "confirmed" | "pending" | "cancelled" |"completed";
    isVideoCall:boolean
    //consultationFee: number;
   // paymentStatus: "pending" | "paid" | "failed";
  };
}
