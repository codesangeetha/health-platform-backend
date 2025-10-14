// Create Lab Test Category
export interface CreateLabTestCategoryRequest {
  name: string;
  description?: string;
  status: "active" | "inactive";
}

export interface CreateLabTestCategoryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    categoryId: string;
    name: string;
    description?: string;
    status: "active" | "inactive";
    createdAt: string;
  };
}

// Get All Lab Test Categories
export interface GetLabTestCategoriesRequest {
  page?: number;
  limit?: number;
  status?: "active" | "inactive";
  search?: string;
}

export interface GetLabTestCategoriesResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    categories: Array<{
      categoryId: string;
      name: string;
      description?: string;
      status: "active" | "inactive";
      createdAt: string;
      updatedAt: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

// Get Lab Test Category by ID
export interface GetLabTestCategoryByIdResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    categoryId: string;
    name: string;
    description?: string;
    status: "active" | "inactive";
    createdAt: string;
    updatedAt: string;
  };
}

// Update Lab Test Category
export interface UpdateLabTestCategoryRequest {
  name?: string;
  description?: string;
  status?: "active" | "inactive";
}

export interface UpdateLabTestCategoryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    categoryId: string;
    name: string;
    description?: string;
    status: "active" | "inactive";
    updatedAt: string;
  };
}

// Delete Lab Test Category
export interface DeleteLabTestCategoryResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    categoryId: string;
    deletedAt: string;
  };
}