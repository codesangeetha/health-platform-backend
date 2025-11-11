export interface DeleteDoctorRequest {
    doctorId: string;
    reason?: string;
}

export interface DeleteDoctorResponse {
    success: boolean;
    message: string;
    data: {
        doctorId: string;
        deletedAt: string;
    };
    timestamp: string;
}