import { AppError } from '@/shared/errors/app-error';
import { IMedicineRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository.interface';
import { IGetMedicineUseCase } from '../interfaces/pharmacyAdmin/get-medicine.use-case.interface';
import { GetAllMedicinesRequest, GetAllMedicinesResponse } from '@/domain/types/pharmacyAdmin/get-medicine.type';


export class GetMedicineUseCase implements IGetMedicineUseCase {
    constructor(
        private readonly medicineRepository: IMedicineRepository
    ) { }

    async execute(request: GetAllMedicinesRequest): Promise<GetAllMedicinesResponse> {

        const page = request.page ?? 1;
        const limit = request.limit ?? 10;

        const { medicines, total } = await this.medicineRepository.findAll(page, limit, request.status, request.name, request.category)

        if (!medicines || medicines.length === 0) {
            throw new AppError('Medicines not found', 'MEDICINES_NOT_FOUND', 404);
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
    }

}
