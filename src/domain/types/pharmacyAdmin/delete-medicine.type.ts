// Request type for delete medicine
export interface DeleteMedicineRequest {
    medicineId: string;
}

// Response type for delete medicine
export interface DeleteMedicineResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: {
        medicineId: string;
        status: string;
        deletedAt: string;
    };
}