import { AppError } from '@/shared/errors/app-error';
import { IMedicineRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository.interface';
import { ISearchMedicinesUseCase } from '../interfaces/pharmacyAdmin/search-medicines.use-case.interface';
import { SearchMedicinesRequest, SearchMedicinesResponse } from '@/domain/types/pharmacyAdmin/search-medicines.type';

export class SearchMedicinesUseCase implements ISearchMedicinesUseCase {
    constructor(
        private readonly medicineRepository: IMedicineRepository
    ) { }

    async execute(request: SearchMedicinesRequest): Promise<SearchMedicinesResponse> {
        const page = request.page ?? 1;
        const limit = request.limit ?? 10;

        try {
            const { medicines, total } = await this.medicineRepository.searchMedicines(
                page,
                limit,
                request.query,
                request.category,
                request.name,
                request.genericName,
                request.priceMin,
                request.priceMax,
                request.stockMin,
                request.stockMax,
                request.createdDateFrom,
                request.createdDateTo,
                request.sortBy,
                request.sortOrder
            );

            if (!medicines || medicines.length === 0) {
                return {
                    success: true,
                    message: 'No medicines found matching the search criteria',
                    data: {
                        medicines: [],
                        pagination: {
                            page,
                            limit,
                            total: 0,
                            totalPages: 0
                        }
                    },
                    timestamp: new Date().toISOString()
                };
            }

            const totalPages = Math.ceil(total / limit);

            return {
                success: true,
                message: 'Medicines retrieved successfully',
                data: {
                    medicines,
                    pagination: {
                        page,
                        limit,
                        total,
                        totalPages
                    }
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to search medicines', 'SEARCH_MEDICINES_ERROR', 500);
        }
    }
}