export interface GetPatientDashboardCountsRequest {
  patientId: string;
}

export interface PatientDashboardCounts {
  upcomingAppointments: number;
  allAppointments: number;
  lastVisitDate: string | null;
}

export interface GetPatientDashboardCountsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: PatientDashboardCounts;
}