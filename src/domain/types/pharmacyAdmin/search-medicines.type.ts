import { Medicine } from "@/domain/entities/medicine.entity";

// Request type for search medicines
export interface SearchMedicinesRequest {
    query?: string; // Search by medicine name or generic name
    category?: string; // Filter by medicine category
    page: number;
    limit: number;
    // New filter fields
    name?: string; // Filter by medicine name
    genericName?: string; // Filter by generic name
    priceMin?: number; // Minimum price filter
    priceMax?: number; // Maximum price filter
    stockMin?: number; // Minimum stock filter
    stockMax?: number; // Maximum stock filter
    createdDateFrom?: string; // Created date range start (ISO string)
    createdDateTo?: string; // Created date range end (ISO string)
    sortBy?: 'name' | 'genericName' | 'price' | 'stock' | 'createdAt'; // Sort field
    sortOrder?: 'asc' | 'desc'; // Sort order
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