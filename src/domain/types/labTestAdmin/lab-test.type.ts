// Create Lab Test
export interface CreateLabTestRequest {
  name: string;
  categoryId: string;
  price: number;
  description?: string;
  isActive: boolean;
}

export interface CreateLabTestResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    testId: string;
    name: string;
    categoryId: string;
    price: number;
    description?: string;
    isActive: boolean;
    createdAt: string;
  };
}

// Get All Lab Tests
export interface GetLabTestsRequest {
  page?: number;
  limit?: number;
  categoryId?: string;
  isActive?: boolean;
  search?: string;
  name?: string;
  description?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GetLabTestsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    tests: Array<{
      testId: string;
      name: string;
      categoryId: string;
      categoryName?: string;
      price: number;
      description?: string;
      isActive: boolean;
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

// Get Lab Test by ID
export interface GetLabTestByIdResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    testId: string;
    name: string;
    categoryId: string;
    categoryName?: string;
    price: number;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// Update Lab Test
export interface UpdateLabTestRequest {
  name?: string;
  categoryId?: string;
  price?: number;
  description?: string;
  isActive?: boolean;
}

export interface UpdateLabTestResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    testId: string;
    name: string;
    categoryId: string;
    price: number;
    description?: string;
    isActive: boolean;
    updatedAt: string;
  };
}

// Delete Lab Test
export interface DeleteLabTestResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    testId: string;
    deletedAt: string;
  };
}