import { UpdateLabTestRequest, UpdateLabTestResponse } from '@/domain/types/labTestAdmin/lab-test.type';

export interface IUpdateLabTestUseCase {
    execute(testId: string, request: UpdateLabTestRequest): Promise<UpdateLabTestResponse>
}