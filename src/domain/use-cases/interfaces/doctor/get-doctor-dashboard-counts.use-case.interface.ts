import { GetDoctorDashboardCountsRequest, GetDoctorDashboardCountsResponse } from '@/domain/types/doctor/doctor-dashboard-counts.type';

export interface IGetDoctorDashboardCountsUseCase {
  execute(request: GetDoctorDashboardCountsRequest): Promise<GetDoctorDashboardCountsResponse>;
}