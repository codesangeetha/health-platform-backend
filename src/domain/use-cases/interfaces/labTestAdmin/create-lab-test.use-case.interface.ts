import { CreateLabTestRequest, CreateLabTestResponse } from '@/domain/types/labTestAdmin/lab-test.type';

export interface ICreateLabTestUseCase {
    execute(request: CreateLabTestRequest): Promise<CreateLabTestResponse>
}