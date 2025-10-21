import { GetAllOrdersRequest, GetAllOrdersResponse } from '@/domain/types/pharmacyAdmin/get-all-orders.type';

export interface IGetAllOrdersUseCase {
    execute(request: GetAllOrdersRequest): Promise<GetAllOrdersResponse>
}