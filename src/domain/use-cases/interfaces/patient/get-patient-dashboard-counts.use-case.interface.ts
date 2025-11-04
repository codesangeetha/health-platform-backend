import { GetPatientDashboardCountsRequest, GetPatientDashboardCountsResponse } from '@/domain/types/patient/patient-dashboard-counts.type';

export interface IGetPatientDashboardCountsUseCase {
  execute(request: GetPatientDashboardCountsRequest): Promise<GetPatientDashboardCountsResponse>;
}