import { OrderLabTestRequest, OrderLabTestResponse } from '@/domain/types/labTestOrder/order-lab-test.type';

export interface IOrderLabTestUseCase {
    execute(request: OrderLabTestRequest): Promise<OrderLabTestResponse>
}