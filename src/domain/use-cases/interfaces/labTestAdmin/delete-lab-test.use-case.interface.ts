import { DeleteLabTestResponse } from '@/domain/types/labTestAdmin/lab-test.type';

export interface IDeleteLabTestUseCase {
    execute(testId: string): Promise<DeleteLabTestResponse>
}