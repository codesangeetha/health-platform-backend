import { Medicine } from "@/domain/entities/medicine.entity";

// Request type for search medicines
export interface SearchMedicinesRequest {
    query?: string; // Search by medicine name or generic name
    category?: string; // Filter by medicine category
    page: number;
    limit: number;
}

// Response type for search medicines
export interface SearchMedicinesResponse {
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