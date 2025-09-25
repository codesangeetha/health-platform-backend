export interface GetAppointmentDetailsRequest {
    appointmentId: string;
}

export interface GetAppointmentDetailsResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: {
        appointmentId: string;
        patientId: string;
        doctorId: string;
        date: string;
        time: string;
        isVideoCall: boolean;
        status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
        reason?: string|undefined;
        createdAt: string;
        updatedAt: string;
    };
}