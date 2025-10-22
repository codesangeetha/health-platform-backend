import { PharmacyMedicineRequest, PharmacyMedicineResponse } from '@/domain/types/pharmacyAdmin/add-medicine.type';

export interface IAddMedicineUseCase {
    execute(request: PharmacyMedicineRequest): Promise<PharmacyMedicineResponse>
}