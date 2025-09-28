import { PharmacyCategory } from "@/domain/entities/pharmacyCategory.entity";

// Request type (optional since GET usually has query params)
export interface GetPharmacyCategoriesRequest {
    page?: number;
    limit?: number;
    status?: 'active' | 'inactive';
    name?: string; // for search filter
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
