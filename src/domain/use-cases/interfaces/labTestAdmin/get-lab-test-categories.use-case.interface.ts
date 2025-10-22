import { GetLabTestCategoriesRequest, GetLabTestCategoriesResponse } from '@/domain/types/labTestAdmin/lab-test-category.type';

export interface IGetLabTestCategoriesUseCase {
    execute(request: GetLabTestCategoriesRequest): Promise<GetLabTestCategoriesResponse>
}