import { AppError } from '@/shared/errors/app-error';
import { IMedicineRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository.interface';
import { IGetMedicineDetailsUseCase } from '../interfaces/pharmacyAdmin/get-medicine-details.use-case.interface';
import { GetMedicineDetailsRequest, GetMedicineDetailsResponse } from '@/domain/types/pharmacyAdmin/get-medicine-details.type';

export class GetMedicineDetailsUseCase implements IGetMedicineDetailsUseCase {
    constructor(
        private readonly medicineRepository: IMedicineRepository
    ) { }

    async execute(request: GetMedicineDetailsRequest): Promise<GetMedicineDetailsResponse> {
        try {
            const medicine = await this.medicineRepository.findById(request.medicineId);

            if (!medicine) {
                throw new AppError('Medicine not found', 'MEDICINE_NOT_FOUND', 404);
            }

            const responseData: any = {
                medicineId: medicine.id,
                name: medicine.name,
                genericName: medicine.genericName,
                category: medicine.category,
                price: medicine.price,
                stock: medicine.stock,
                prescriptionRequired: false // This field is not in the entity, defaulting to false
            };

            // Add optional fields only if they exist
            if (medicine.manufacturer) responseData.manufacturer = medicine.manufacturer;
            if (medicine.description) responseData.description = medicine.description;
            if (medicine.dosage) responseData.dosage = medicine.dosage;
            if (medicine.sideEffects && medicine.sideEffects.length > 0) responseData.sideEffects = medicine.sideEffects;
            if (medicine.interactions && medicine.interactions.length > 0) responseData.interactions = medicine.interactions;
            if (medicine.ingredients && medicine.ingredients.length > 0) responseData.ingredients = medicine.ingredients;
            if (medicine.storage) responseData.storage = medicine.storage;
            if (medicine.expiryDate) responseData.expiryDate = medicine.expiryDate;
            if (medicine.status) responseData.status = medicine.status;
            if (medicine.createdAt) responseData.createdAt = medicine.createdAt;
            if (medicine.updatedAt) responseData.updatedAt = medicine.updatedAt;

            return {
                success: true,
                message: 'Medicine details retrieved successfully',
                data: responseData,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to retrieve medicine details', 'GET_MEDICINE_DETAILS_ERROR', 500);
        }
    }
}