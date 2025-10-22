import { GetLabTestOrdersRequest, GetLabTestOrdersResponse } from '@/domain/types/labTestOrder/get-lab-test-orders.type';

export interface IGetLabTestOrdersUseCase {
    execute(request: GetLabTestOrdersRequest): Promise<GetLabTestOrdersResponse>
}