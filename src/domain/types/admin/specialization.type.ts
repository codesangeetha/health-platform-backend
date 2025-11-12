export interface CreateSpecializationRequest {
    name: string;
}

export interface CreateSpecializationResponse {
    success: boolean;
    message: string;
    data: {
        specializationId: string;
        name: string;
        createdAt: string;
    };
    timestamp: string;
}

export interface GetAllSpecializationsResponse {
    success: boolean;
    message: string;
    data: {
        specializations: {
            id: string;
            name: string;
            createdAt: string;
            updatedAt: string;
        }[];
        totalCount: number;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalCount: number;
            limit: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    };
    timestamp: string;
}

export interface UpdateSpecializationRequest {
    name: string;
}

export interface UpdateSpecializationResponse {
    success: boolean;
    message: string;
    data: {
        specializationId: string;
        name: string;
        updatedAt: string;
    };
    timestamp: string;
}

export interface DeleteSpecializationResponse {
    success: boolean;
    message: string;
    data: {
        specializationId: string;
        deletedAt: string;
    };
    timestamp: string;
}