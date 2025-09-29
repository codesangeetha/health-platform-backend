// Request type for get medicine details
export interface GetMedicineDetailsRequest {
    medicineId: string;
}

// Response type for get medicine details
export interface GetMedicineDetailsResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: {
        medicineId: string;
        name: string;
        genericName: string;
        category: string;
        manufacturer?: string;
        price: number;
        stock: number;
        prescriptionRequired: boolean;
        description?: string;
        dosage?: string;
        sideEffects?: string[];
        interactions?: string[];
        ingredients?: string[];
        storage?: string;
        expiryDate?: Date;
        status?: 'active' | 'inactive';
        createdAt?: Date;
        updatedAt?: Date;
    };
}