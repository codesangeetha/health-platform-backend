// Request type for getting pharmacy dashboard counts
export interface GetPharmacyDashboardCountsRequest {}

// Response type for getting pharmacy dashboard counts
export interface GetPharmacyDashboardCountsResponse {
  success: boolean;
  data: {
    totalMedicines: number;
    totalOrders: number;
  };
  timestamp: string;
}