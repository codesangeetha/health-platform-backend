import { UpdatePharmacyCategoryRequest, UpdatePharmacyCategoryResponse } from '@/domain/types/pharmacyAdmin/update-pharmacy-category.type';

export interface IUpdatePharmacyCategoryUseCase {
  execute(request: UpdatePharmacyCategoryRequest, categoryId: string): Promise<UpdatePharmacyCategoryResponse>;
}