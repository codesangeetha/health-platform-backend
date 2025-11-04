export interface GetDashboardCountsRequest {
  // No specific request parameters needed for dashboard counts
}

export interface GetDashboardCountsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    totalPatients: number;
    totalDoctors: number;
    totalAppointments: number;
    totalMedicines: number;
    totalLabTests: number;
    totalPharmacyCategories: number;
    totalLabTestCategories: number;
  };
}