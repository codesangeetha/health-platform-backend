// Request body type
export interface DeletePharmacyCategoryRequest {
  categoryId: string;
}

// Response body type
export interface DeletePharmacyCategoryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    deletedCategoryId: string;
  };
}