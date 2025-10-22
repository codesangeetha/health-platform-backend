import { Appointment } from "@/domain/entities/appointment.entity";

export interface GetPatientAppointmentsRequest {
    page?: number;
    limit?: number;
    status?:"confirmed" | "pending" | "cancelled" | "completed";
}


// Response type for GET /appointments/patient
export interface GetPatientAppointmentsResponse {
    success: boolean;
    message: string;
    timestamp: string; // ISO date string
    data: {
        appointments: Appointment[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}
