import { DeletePharmacyCategoryRequest, DeletePharmacyCategoryResponse } from '@/domain/types/pharmacyAdmin/delete-pharmacy-category.type';

export interface IDeletePharmacyCategoryUseCase {
  execute(request: DeletePharmacyCategoryRequest): Promise<DeletePharmacyCategoryResponse>;
}