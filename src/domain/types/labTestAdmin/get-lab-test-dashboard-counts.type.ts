// Request type for getting lab test dashboard counts
export interface GetLabTestDashboardCountsRequest {}

// Response type for getting lab test dashboard counts
export interface GetLabTestDashboardCountsResponse {
  success: boolean;
  data: {
    totalLabTests: number;
    totalLabTestOrders: number;
  };
  timestamp: string;
}
