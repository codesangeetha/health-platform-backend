import { DeleteMedicineRequest, DeleteMedicineResponse } from '@/domain/types/pharmacyAdmin/delete-medicine.type';

export interface IDeleteMedicineUseCase {
    execute(request: DeleteMedicineRequest): Promise<DeleteMedicineResponse>;
}