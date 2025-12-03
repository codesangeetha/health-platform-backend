import { GetLabTestOrderByIdRequest, GetLabTestOrderByIdResponse } from '@/domain/types/labTestOrder/get-lab-test-order-by-id.type';

export interface IGetLabTestOrderByIdUseCase {
    execute(request: GetLabTestOrderByIdRequest): Promise<GetLabTestOrderByIdResponse>;
}