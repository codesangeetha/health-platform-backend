import { UpdateMedicineRequest, UpdateMedicineResponse } from '@/domain/types/pharmacyAdmin/update-medicine.type';

export interface IUpdateMedicineUseCase {
    execute(request: UpdateMedicineRequest): Promise<UpdateMedicineResponse>;
}