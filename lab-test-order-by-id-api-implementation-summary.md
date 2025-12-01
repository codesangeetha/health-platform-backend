# Lab Test Order by ID API Implementation Summary

## Overview
This document summarizes the implementation of a new API endpoint for retrieving a specific lab test order by its ID. The API provides detailed information about a single lab test order including test items, status, scheduling information, and results.

## API Endpoint
**GET** `/api/v1/pharmacy/lab-test-orders/:orderId`

## Implementation Details

### 1. Type Definitions
**File:** `src/domain/types/labTestOrder/get-lab-test-order-by-id.type.ts`

- `GetLabTestOrderByIdRequest`: Interface for the request parameters
- `GetLabTestOrderByIdResponse`: Interface for the response structure with detailed order information

### 2. Use Case Layer

#### Interface
**File:** `src/domain/use-cases/interfaces/labTestOrder/get-lab-test-order-by-id.use-case.interface.ts`

#### Implementation  
**File:** `src/domain/use-cases/labTestOrder/get-lab-test-order-by-id.use-case.ts`

**Features:**
- Validates order ID and user authorization
- Fetches order using `findByOrderId` from repository
- Includes security check to ensure users can only access their own orders
- Formats comprehensive response with all order details
- Handles result extraction for completed orders

### 3. Controller Layer

#### Interface
**File:** `src/application/controllers/interfaces/labTestOrder/get-lab-test-order-by-id.controller.interface.ts`

#### Implementation
**File:** `src/application/controllers/labTestOrder/get-lab-test-order-by-id.controller.ts`

**Features:**
- Extracts order ID from URL parameters
- Validates user authentication
- Handles errors and returns appropriate HTTP status codes
- Integrates with the use case layer

### 4. Route Configuration

**File:** `src/infrastructure/entry-points/api/routes/labTestOrder.route.ts`

**Changes:**
- Added import for `GetLabTestOrderByIdController`
- Updated constructor to include the new controller
- Added new route: `GET '/lab-test-orders/:orderId'`

### 5. Dependency Injection

**File:** `src/infrastructure/entry-points/api/container.ts`

**Changes:**
- Added import for `GetLabTestOrderByIdUseCase` and `GetLabTestOrderByIdController`
- Created use case instance: `getLabTestOrderByIdUseCase`
- Created controller instance: `getLabTestOrderByIdController`
- Updated `LabTestOrderRoute` constructor call

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Lab test order retrieved successfully",
  "timestamp": "2025-12-01T07:12:50.291Z",
  "data": {
    "order": {
      "orderId": "ORD-123456789",
      "orderDate": "2025-12-01T07:00:00.000Z",
      "status": "pending",
      "totalAmount": 1500,
      "testItems": [
        {
          "testName": "Complete Blood Count",
          "price": 500,
          "labTestId": "lab123",
          "labTestDetails": {
            "name": "Complete Blood Count",
            "description": "Standard blood test",
            "category": "Hematology"
          }
        }
      ],
      "collectionMethod": "home_collection",
      "scheduledDate": "2025-12-02T10:00:00.000Z",
      "collectionAddress": {
        "street": "123 Main St",
        "city": "Mumbai",
        "state": "Maharashtra",
        "postalCode": "400001"
      },
      "trackingNumber": "TRK123456789"
    }
  }
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "success": false,
  "message": "Order ID is required",
  "error": "ORDER_ID_REQUIRED"
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "User not authenticated",
  "error": "UNAUTHORIZED"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "message": "Unauthorized access to this order",
  "error": "UNAUTHORIZED"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "Lab test order not found",
  "error": "ORDER_NOT_FOUND"
}
```

## Security Features

1. **Authentication Required**: All requests must include a valid JWT token
2. **Authorization Check**: Users can only access their own lab test orders
3. **Input Validation**: Order ID and user ID are validated before processing
4. **Error Handling**: Proper error messages without exposing sensitive information

## Testing

**File:** `test-labtest-order-by-id.http`

The test file includes:
- Login procedure to get authentication token
- Test case for retrieving a valid order
- Test case for non-existent order ID (404 error)
- Test case for missing authentication token (401 error)

## Files Created/Modified

### New Files Created
1. `src/domain/types/labTestOrder/get-lab-test-order-by-id.type.ts`
2. `src/domain/use-cases/interfaces/labTestOrder/get-lab-test-order-by-id.use-case.interface.ts`
3. `src/domain/use-cases/labTestOrder/get-lab-test-order-by-id.use-case.ts`
4. `src/application/controllers/interfaces/labTestOrder/get-lab-test-order-by-id.controller.interface.ts`
5. `src/application/controllers/labTestOrder/get-lab-test-order-by-id.controller.ts`
6. `test-labtest-order-by-id.http`

### Existing Files Modified
1. `src/infrastructure/entry-points/api/routes/labTestOrder.route.ts`
2. `src/infrastructure/entry-points/api/container.ts`

## Integration

The new API endpoint integrates seamlessly with the existing lab test order system:
- Uses the same repository layer (`ILabTestOrderRepository`)
- Follows the same architectural patterns as other endpoints
- Maintains consistency with existing error handling and response formats
- Preserves security requirements and authentication middleware

## Conclusion

The implementation provides a robust, secure, and well-structured API endpoint for retrieving lab test orders by ID. It follows the established patterns in the codebase and integrates properly with the existing infrastructure.