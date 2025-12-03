import { GetLabTestDashboardCountsRequest, GetLabTestDashboardCountsResponse } from '@/domain/types/labTestAdmin/get-lab-test-dashboard-counts.type';

export interface IGetLabTestDashboardCountsUseCase {
  execute(request: GetLabTestDashboardCountsRequest): Promise<GetLabTestDashboardCountsResponse>;
}
