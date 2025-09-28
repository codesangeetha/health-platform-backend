import { GetPharmacyCategoriesRequest, GetPharmacyCategoriesResponse } from '@/domain/types/pharmacyAdmin/get-med-category.type';

export interface IGetMedCategoryUseCase {
    execute(request: GetPharmacyCategoriesRequest): Promise<GetPharmacyCategoriesResponse>;
}