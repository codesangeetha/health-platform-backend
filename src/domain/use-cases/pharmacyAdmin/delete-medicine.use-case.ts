import { AppError } from '@/shared/errors/app-error';
import { IMedicineRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository.interface';
import { IDeleteMedicineUseCase } from '../interfaces/pharmacyAdmin/delete-medicine.use-case.interface';
import { DeleteMedicineRequest, DeleteMedicineResponse } from '@/domain/types/pharmacyAdmin/delete-medicine.type';

export class DeleteMedicineUseCase implements IDeleteMedicineUseCase {
    constructor(
        private readonly medicineRepository: IMedicineRepository
    ) { }

    async execute(request: DeleteMedicineRequest): Promise<DeleteMedicineResponse> {
        try {
            // Check if medicine exists before deletion
            const existingMedicine = await this.medicineRepository.findById(request.medicineId);
            if (!existingMedicine) {
                throw new AppError('Medicine not found', 'MEDICINE_NOT_FOUND', 404);
            }

            // Delete the medicine from database
            const deletedMedicine = await this.medicineRepository.delete(request.medicineId);

            return {
                success: true,
                message: 'Medicine deleted successfully',
                data: {
                    medicineId: deletedMedicine.id,
                    status: 'deleted',
                    deletedAt: new Date().toISOString()
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to delete medicine', 'DELETE_MEDICINE_ERROR', 500);
        }
    }
}