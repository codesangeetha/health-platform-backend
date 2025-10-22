// Request type for update medicine
export interface UpdateMedicineRequest {
    medicineId: string;
    name?: string;
    genericName?: string;
    category?: string;
    manufacturer?: string;
    price?: number;
    description?: string;
    dosage?: string;
    sideEffects?: string[];
    interactions?: string[];
    ingredients?: string[];
    storage?: string;
    status?: 'active' | 'inactive';
}

// Response type for update medicine
export interface UpdateMedicineResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: {
        medicineId: string;
        name: string;
        price: number;
        status: 'active' | 'inactive';
        updatedAt: string;
    };
}