import { UpdateOrderStatusRequest, UpdateOrderStatusResponse } from '@/domain/types/pharmacyAdmin/update-order-status.type';

export interface IUpdateOrderStatusUseCase {
    execute(orderId: string, request: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse>;
}