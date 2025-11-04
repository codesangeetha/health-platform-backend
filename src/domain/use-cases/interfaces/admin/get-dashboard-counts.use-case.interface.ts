import { GetDashboardCountsRequest, GetDashboardCountsResponse } from '@/domain/types/admin/dashboard-counts.type';

export interface IGetDashboardCountsUseCase {
  execute(request: GetDashboardCountsRequest): Promise<GetDashboardCountsResponse>;
}