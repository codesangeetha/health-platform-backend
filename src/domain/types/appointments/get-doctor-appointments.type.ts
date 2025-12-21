// Request type
export interface GetDoctorAppointmentsRequest {
    date?: string;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    page?: number;
    limit?: number;
}

// Response type
export interface GetDoctorAppointmentsResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: {
        appointments: Array<{
            appointmentId: string;
            patient: {
                patientId: string;
                firstName: string;
                lastName: string;
                age: number;
            };
            date: string | undefined;
            time: string;
            status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
            appointmentType: 'in-person' | 'video';
            reason: string | undefined;
            createdAt: string;
        }>;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}