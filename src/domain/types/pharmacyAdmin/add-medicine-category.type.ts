// Request body type
export interface AddPharmacyCategoryRequest {
  name: string;
  description?: string;
  status: "active" | "inactive";
}

// Response body type
export interface AddPharmacyCategoryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    categoryId: string;
    name: string;
    status: "active" | "inactive";
    createdAt: string;
  };
}
