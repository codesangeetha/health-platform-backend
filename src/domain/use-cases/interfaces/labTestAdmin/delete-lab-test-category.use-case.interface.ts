import { DeleteLabTestCategoryResponse } from '@/domain/types/labTestAdmin/lab-test-category.type';

export interface IDeleteLabTestCategoryUseCase {
    execute(categoryId: string): Promise<DeleteLabTestCategoryResponse>
}