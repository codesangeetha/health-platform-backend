import { GetLabTestCategoryByIdResponse } from '@/domain/types/labTestAdmin/lab-test-category.type';

export interface IGetLabTestCategoryUseCase {
    execute(categoryId: string): Promise<GetLabTestCategoryByIdResponse>
}