import { Medicine } from "@/domain/entities/medicine.entity";

// Request type (with pagination + filters)
export interface GetAllMedicinesRequest {
    page: number;
    limit: number;
    status?: 'active' | 'inactive';
    name?: string;
    category?: string;
    genericName?: string;
    fromDate?: string;
    toDate?: string;
}

// Response type
export interface GetAllMedicinesResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: {
        medicines: Medicine[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}
