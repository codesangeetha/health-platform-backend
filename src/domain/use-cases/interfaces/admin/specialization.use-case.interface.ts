import {
    CreateSpecializationRequest,
    CreateSpecializationResponse,
    GetAllSpecializationsResponse,
    UpdateSpecializationRequest,
    UpdateSpecializationResponse,
    DeleteSpecializationResponse
} from '@/domain/types/admin/specialization.type';

export interface ISpecializationUseCase {
    // Create a new specialization
    create(request: CreateSpecializationRequest): Promise<CreateSpecializationResponse>;
    
    // Get all specializations with pagination and search
    getAll(page?: number, limit?: number, searchFilters?: SpecializationSearchFilters): Promise<GetAllSpecializationsResponse>;
    
    // Update a specialization
    update(specializationId: string, request: UpdateSpecializationRequest): Promise<UpdateSpecializationResponse>;
    
    // Delete a specialization
    delete(specializationId: string): Promise<DeleteSpecializationResponse>;
}

export interface SpecializationSearchFilters {
    name?: string;
    createdAt?: {
        gte?: Date;
        lte?: Date;
    };
}