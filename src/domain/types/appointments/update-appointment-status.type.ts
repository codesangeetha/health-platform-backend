// Request type
export interface UpdateAppointmentStatusRequest {
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reason?: string;
}

// Response type
export interface UpdateAppointmentStatusResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    appointmentId: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    reason: string | undefined;
    updatedAt: string;
  };
}