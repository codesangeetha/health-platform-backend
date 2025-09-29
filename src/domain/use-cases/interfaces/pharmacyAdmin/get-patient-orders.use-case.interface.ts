import { GetPatientOrdersRequest, GetPatientOrdersResponse } from '@/domain/types/pharmacyAdmin/get-patient-orders.type';

export interface IGetPatientOrdersUseCase {
    execute(request: GetPatientOrdersRequest): Promise<GetPatientOrdersResponse>
}