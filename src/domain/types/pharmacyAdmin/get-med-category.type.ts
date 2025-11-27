import { PharmacyCategory } from "@/domain/entities/pharmacyCategory.entity";

// Request type (optional since GET usually has query params)
export interface GetPharmacyCategoriesRequest {
    page?: number;
    limit?: number;
    status?: 'active' | 'inactive';
    name?: string; // for search filter
    description?: string; // for search filter
    fromDate?: string; // for date range filter (start date)
    toDate?: string; // for date range filter (end date)
}

// Response type
export interface GetPharmacyCategoriesResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: {
        categories: PharmacyCategory[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };

    };
}
