import { UpdateMedicineInventoryRequest, UpdateMedicineInventoryResponse } from '@/domain/types/pharmacyAdmin/update-medicine-inventory.type';

export interface IUpdateMedicineInventoryUseCase {
    execute(request: UpdateMedicineInventoryRequest): Promise<UpdateMedicineInventoryResponse>;
}