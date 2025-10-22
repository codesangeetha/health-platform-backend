import { GetMedicineDetailsRequest, GetMedicineDetailsResponse } from '@/domain/types/pharmacyAdmin/get-medicine-details.type';

export interface IGetMedicineDetailsUseCase {
    execute(request: GetMedicineDetailsRequest): Promise<GetMedicineDetailsResponse>;
}