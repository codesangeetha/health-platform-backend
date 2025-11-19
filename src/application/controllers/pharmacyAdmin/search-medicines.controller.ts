import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { ISearchMedicinesUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/search-medicines.use-case.interface';
import { SearchMedicinesRequest } from '@/domain/types/pharmacyAdmin/search-medicines.type';
import { ISearchMedicinesController } from '../interfaces/pharmacyAdmin/search-medicines.controller.interface';

export class SearchMedicinesController implements ISearchMedicinesController {
    constructor(
        private readonly searchMedicinesUseCase: ISearchMedicinesUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {
            // Get query parameters with defaults
            const query = request.query.query as string | undefined;
            const category = request.query.category as string | undefined;
            const name = request.query.name as string | undefined;
            const genericName = request.query.genericName as string | undefined;
            // Support both priceMin/minPrice and priceMax/maxPrice parameter names
            const priceMin = request.query.priceMin ? parseFloat(request.query.priceMin as string) :
                           request.query.minPrice ? parseFloat(request.query.minPrice as string) : undefined;
            const priceMax = request.query.priceMax ? parseFloat(request.query.priceMax as string) :
                           request.query.maxPrice ? parseFloat(request.query.maxPrice as string) : undefined;
            const stockMin = request.query.stockMin ? parseInt(request.query.stockMin as string, 10) : undefined;
            const stockMax = request.query.stockMax ? parseInt(request.query.stockMax as string, 10) : undefined;
            const createdDateFrom = request.query.createdDateFrom as string | undefined;
            const createdDateTo = request.query.createdDateTo as string | undefined;
            const sortBy = request.query.sortBy as 'name' | 'genericName' | 'price' | 'stock' | 'createdAt' | undefined;
            const sortOrder = request.query.sortOrder as 'asc' | 'desc' | undefined;
            const page = request.query.page ? parseInt(request.query.page as string, 10) : 1;
            const limit = request.query.limit ? parseInt(request.query.limit as string, 10) : 10;

            const searchMedicinesRequest: SearchMedicinesRequest = {
                ...(query && { query }),
                ...(category && { category }),
                ...(name && { name }),
                ...(genericName && { genericName }),
                ...(priceMin !== undefined && { priceMin }),
                ...(priceMax !== undefined && { priceMax }),
                ...(stockMin !== undefined && { stockMin }),
                ...(stockMax !== undefined && { stockMax }),
                ...(createdDateFrom && { createdDateFrom }),
                ...(createdDateTo && { createdDateTo }),
                ...(sortBy && { sortBy }),
                ...(sortOrder && { sortOrder }),
                page: page,
                limit: limit
            };

            const result = await this.searchMedicinesUseCase.execute(searchMedicinesRequest);

            response.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                response.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.errorCode,
                    timestamp: new Date().toISOString()
                });
            } else {
                response.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: 'INTERNAL_SERVER_ERROR',
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
}