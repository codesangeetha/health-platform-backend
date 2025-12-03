import { GetPharmacyDashboardCountsRequest, GetPharmacyDashboardCountsResponse } from '@/domain/types/pharmacyAdmin/get-pharmacy-dashboard-counts.type';

export interface IGetPharmacyDashboardCountsUseCase {
  execute(request: GetPharmacyDashboardCountsRequest): Promise<GetPharmacyDashboardCountsResponse>;
}