import { CreateLabTestCategoryRequest, CreateLabTestCategoryResponse } from '@/domain/types/labTestAdmin/lab-test-category.type';

export interface ICreateLabTestCategoryUseCase {
    execute(request: CreateLabTestCategoryRequest): Promise<CreateLabTestCategoryResponse>
}