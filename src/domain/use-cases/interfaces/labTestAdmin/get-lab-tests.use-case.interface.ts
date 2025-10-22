import { GetLabTestsRequest, GetLabTestsResponse } from '@/domain/types/labTestAdmin/lab-test.type';

export interface IGetLabTestsUseCase {
    execute(request: GetLabTestsRequest): Promise<GetLabTestsResponse>
}