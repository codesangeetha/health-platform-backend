export interface GetDoctorDashboardCountsRequest {
  doctorId: string;
}

export interface DoctorDashboardCounts {
  todayAppointments: number;
  totalAppointments: number;
  pendingConsultations: number;
  todayCompletedConsultations: number;
}

export interface GetDoctorDashboardCountsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: DoctorDashboardCounts;
}