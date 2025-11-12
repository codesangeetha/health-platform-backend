import { ISpecializationUseCase, SpecializationSearchFilters } from '@/domain/use-cases/interfaces/admin/specialization.use-case.interface';
import { ISpecializationRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/specialization-repository.interface';
import { AppError } from '@/shared/errors/app-error';
import {
  CreateSpecializationRequest,
  CreateSpecializationResponse,
  GetAllSpecializationsResponse,
  UpdateSpecializationRequest,
  UpdateSpecializationResponse,
  DeleteSpecializationResponse
} from '@/domain/types/admin/specialization.type';

export class SpecializationUseCase implements ISpecializationUseCase {
    constructor(
        private readonly specializationRepository: ISpecializationRepository
    ) { }

    async create(request: CreateSpecializationRequest): Promise<CreateSpecializationResponse> {
        // Validate input
        this.validateCreateSpecializationRequest(request);

        // Create specialization
        const specialization = await this.specializationRepository.create(request.name);

        return {
            success: true,
            message: 'Specialization created successfully',
            timestamp: new Date().toISOString(),
            data: {
                specializationId: specialization.id || '',
                name: specialization.name,
                createdAt: specialization.createdAt instanceof Date ? specialization.createdAt.toISOString() : specialization.createdAt
            }
        };
    }

    async getAll(page: number = 1, limit: number = 10, searchFilters?: SpecializationSearchFilters): Promise<GetAllSpecializationsResponse> {
        // Validate and normalize pagination parameters
        const pageNum = Math.max(1, page);
        const limitNum = Math.max(1, Math.min(100, limit)); // Max 100 items per page
        
        // Calculate skip value
        const skip = (pageNum - 1) * limitNum;
        
        // Prepare repository options with search filters
        const repositoryOptions: any = {
            skip,
            limit: limitNum
        };

        // Add search filters to repository options
        if (searchFilters) {
            if (searchFilters.name) {
                repositoryOptions.name = searchFilters.name;
            }
            if (searchFilters.createdAt) {
                repositoryOptions.createdAt = searchFilters.createdAt;
            }
        }
        
        // Get specializations with pagination and filters
        const specializations = await this.specializationRepository.findAll(repositoryOptions);
        
        // Prepare count filter
        const countFilter: any = {};
        if (searchFilters) {
            if (searchFilters.name) {
                countFilter.name = searchFilters.name;
            }
            if (searchFilters.createdAt) {
                countFilter.createdAt = searchFilters.createdAt;
            }
        }
        
        // Get total count for pagination info
        const totalCount = await this.specializationRepository.count(countFilter);
        
        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPreviousPage = pageNum > 1;

        return {
            success: true,
            message: 'Specializations retrieved successfully',
            timestamp: new Date().toISOString(),
            data: {
                specializations: specializations.map(spec => ({
                    id: spec.id || '',
                    name: spec.name,
                    createdAt: spec.createdAt instanceof Date ? spec.createdAt.toISOString() : spec.createdAt,
                    updatedAt: spec.updatedAt instanceof Date ? spec.updatedAt.toISOString() : spec.updatedAt
                })),
                totalCount,
                pagination: {
                    currentPage: pageNum,
                    totalPages,
                    totalCount,
                    limit: limitNum,
                    hasNextPage,
                    hasPreviousPage
                }
            }
        };
    }

    async update(specializationId: string, request: UpdateSpecializationRequest): Promise<UpdateSpecializationResponse> {
        // Validate input
        this.validateUpdateSpecializationRequest(request);

        // Update specialization
        const specialization = await this.specializationRepository.update(specializationId, { name: request.name });

        return {
            success: true,
            message: 'Specialization updated successfully',
            timestamp: new Date().toISOString(),
            data: {
                specializationId: specialization.id || '',
                name: specialization.name,
                updatedAt: specialization.updatedAt instanceof Date ? specialization.updatedAt.toISOString() : specialization.updatedAt
            }
        };
    }

    async delete(specializationId: string): Promise<DeleteSpecializationResponse> {
        // Delete specialization
        await this.specializationRepository.delete(specializationId);

        return {
            success: true,
            message: 'Specialization deleted successfully',
            timestamp: new Date().toISOString(),
            data: {
                specializationId,
                deletedAt: new Date().toISOString()
            }
        };
    }

    private validateCreateSpecializationRequest(request: CreateSpecializationRequest): void {
        if (!request.name || request.name.trim().length === 0) {
            throw new AppError('Specialization name is required', 'SPECIALIZATION_001', 400);
        }
    }

    private validateUpdateSpecializationRequest(request: UpdateSpecializationRequest): void {
        if (!request.name || request.name.trim().length === 0) {
            throw new AppError('Specialization name is required', 'SPECIALIZATION_001', 400);
        }
    }
}