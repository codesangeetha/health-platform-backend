import { GetPharmacyOrderByIdRequest, GetPharmacyOrderByIdResponse } from '@/domain/types/pharmacyAdmin/get-pharmacy-order-by-id.type';

export interface IGetPharmacyOrderByIdUseCase {
    execute(request: GetPharmacyOrderByIdRequest): Promise<GetPharmacyOrderByIdResponse>;
}
