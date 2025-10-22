import{AddPharmacyCategoryRequest,AddPharmacyCategoryResponse} from '@/domain/types/pharmacyAdmin/add-medicine-category.type'

export interface IAddMedCategoryUseCase {
    execute(request: AddPharmacyCategoryRequest): Promise<AddPharmacyCategoryResponse>
}