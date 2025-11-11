export interface DeletePatientByAdminRequest {
    reason?: string;
}

export interface DeletePatientByAdminResponse {
    success: boolean;
    message: string;
    data: {
        patientId: string;
        deletedAt: string;
    };
    timestamp: string;
}