import { UpdateLabTestCategoryRequest, UpdateLabTestCategoryResponse } from '@/domain/types/labTestAdmin/lab-test-category.type';

export interface IUpdateLabTestCategoryUseCase {
    execute(categoryId: string, request: UpdateLabTestCategoryRequest): Promise<UpdateLabTestCategoryResponse>
}