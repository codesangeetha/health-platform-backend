// Request body type
export interface UpdatePharmacyCategoryRequest {
  name?: string;
  description?: string;
  status?: "active" | "inactive";
  editedBy?: string; // User ID who made the edit
}

// Response body type
export interface UpdatePharmacyCategoryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    categoryId: string;
    name: string;
    status: "active" | "inactive";
    updatedAt: string;
  };
}