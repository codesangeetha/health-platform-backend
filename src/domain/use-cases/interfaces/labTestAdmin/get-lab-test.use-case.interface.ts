import { GetLabTestByIdResponse } from '@/domain/types/labTestAdmin/lab-test.type';

export interface IGetLabTestUseCase {
    execute(testId: string): Promise<GetLabTestByIdResponse>
}