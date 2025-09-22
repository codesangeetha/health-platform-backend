// request type
export interface RescheduleAppointmentRequest {
  newDate: string;  
  newTime: string;  
  reason: string;   
}

// response type
export interface RescheduleAppointmentResponse {
  success: boolean;
  message: string;
  timestamp: string; 
  data: {
    appointmentId: string;
    date:string;
    time:string;
    reason:string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  };
}
