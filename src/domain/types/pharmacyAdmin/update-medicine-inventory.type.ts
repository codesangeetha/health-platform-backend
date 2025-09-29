// Request type for update medicine inventory
export interface UpdateMedicineInventoryRequest {
    medicineId: string;
    stock?: number;
    price?: number;
    status?: 'active' | 'inactive';
}

// Response type for update medicine inventory
export interface UpdateMedicineInventoryResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: {
        medicineId: string;
        stock: number;
        price: number;
        status: 'active' | 'inactive';
        updatedAt: Date;
    };
}