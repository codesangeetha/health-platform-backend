// Response type for delete prescription
export interface DeletePrescriptionResponse {
    success: boolean;
    message: string;
    data: {
        deleted: boolean;
        prescriptionId: string;
    };
}