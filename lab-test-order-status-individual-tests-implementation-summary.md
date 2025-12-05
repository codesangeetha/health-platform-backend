# Lab Test Order Status Update API Enhancement Summary

## Overview
Enhanced the Lab Test Order Status Update API to support individual test status updates within an order, allowing some tests to be marked as "completed" while others are "skipped". The total price is recalculated based on non-skipped tests.

## Changes Made

### 1. Database Schema Updates
**File:** `src/domain/entities/lab-test-order.entity.ts`
- Added `testStatus: 'pending' | 'completed' | 'skipped'` field to `LabTestOrderItem` interface
- Updated `toMongoDocument()` and `fromMongoDocument()` methods to handle the new field

### 2. TypeScript Type Definitions
**File:** `src/domain/types/labTestAdmin/update-order-status.type.ts`
- Added `LabTestStatusUpdateItem` interface for individual test status updates
- Added `LabTestOrderItemResponse` interface for response format
- Enhanced `UpdateLabTestOrderStatusRequest` to include optional `tests` array
- Updated `UpdateLabTestOrderStatusResponse` to include `items` array and `totalAmount`

### 3. Repository Interface and Implementation
**Files:** 
- `src/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.interface.ts`
- `src/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.ts`

- Added new method `updateStatusWithIndividualTests()` to the repository interface
- Implemented price recalculation logic in the repository method
- Filter out skipped tests from total amount calculation

### 4. Use Case Logic Enhancement
**File:** `src/domain/use-cases/labTestAdmin/update-order-status.use-case.ts`
- Enhanced `execute()` method to handle both new format (`tests` array) and legacy formats
- Added `handleIndividualTestUpdates()` method for processing individual test statuses
- Added `validateTestUpdates()` method for input validation
- Added `determineFinalOrderStatus()` method for business logic:
  - All tests skipped → order status = "cancelled"
  - At least one test completed → order status = "completed"
  - No tests processed → order status remains as requested

### 5. Controller Update
**File:** `src/application/controllers/labTestAdmin/update-order-status.controller.ts`
- Updated to extract `tests` field from request body
- Pass the new field to the use case

## API Usage

### New Format (Individual Test Statuses)
```bash
curl --location --request PUT 'http://localhost:3000/api/v1/lab-test-orders/{orderId}/status' \
--header 'Authorization: Bearer {token}' \
--header 'Content-Type: application/json' \
--data '{
  "status": "completed",
  "reason": "Some tests skipped",
  "tests": [
    {
      "labTestId": "ID1",
      "testStatus": "completed",
      "testResult": "Result text here"
    },
    {
      "labTestId": "ID2",
      "testStatus": "skipped",
      "testResult": null
    }
  ]
}'
```

### Legacy Format (Still Supported)
```bash
curl --location --request PUT 'http://localhost:3000/api/v1/lab-test-orders/{orderId}/status' \
--header 'Authorization: Bearer {token}' \
--header 'Content-Type: application/json' \
--data '{
  "status": "completed",
  "reason": "Order completed",
  "result": "All tests completed successfully"
}'
```

## Business Logic

### Price Recalculation
- `totalAmount = sum of price for all items where testStatus != "skipped"`
- Only non-skipped tests contribute to the final order total

### Order Status Determination
When `status: "completed"` is requested:
- **All tests skipped** → Final order status becomes `"cancelled"`
- **At least one test completed** → Final order status becomes `"completed"`
- **No tests processed** → Order status remains as originally requested

### Validation Rules
- Each `tests` item must have `labTestId` and `testStatus`
- `testStatus` must be either `"completed"` or `"skipped"`
- `labTestId` must exist in the order items
- If `testStatus: "completed"`, then `testResult` is required
- If `testStatus: "skipped"`, then `testResult` must be `null`

## Response Format
```json
{
  "success": true,
  "message": "Lab test order status updated successfully",
  "timestamp": "2025-12-05T06:40:22.038Z",
  "data": {
    "orderId": "LAB_1764571923653_793",
    "status": "completed",
    "reason": "Mixed results - some tests completed, others skipped",
    "items": [
      {
        "labTestId": "6907074091b451d45062dc25",
        "labTestName": "Complete Blood Count",
        "quantity": 1,
        "price": 150,
        "result": "5.3 million cells/mcL (Normal range: 4.5-6.0)",
        "testStatus": "completed"
      },
      {
        "labTestId": "690708e591b451d45062dc4b",
        "labTestName": "Lipid Profile",
        "quantity": 1,
        "price": 200,
        "result": null,
        "testStatus": "skipped"
      }
    ],
    "totalAmount": 150,
    "updatedAt": "2025-12-05T06:40:22.038Z"
  }
}
```

## Testing
Created test file: `test-labtest-order-status-individual-tests.http`
- Test 1: Mixed completed/skipped tests
- Test 2: All tests skipped (cancelled status)
- Test 3: All tests completed
- Test 4: Legacy format compatibility

## Backward Compatibility
- Legacy API calls using `result` field continue to work
- Existing orders without `testStatus` field default to `"pending"`
- Price recalculation only applies to new format with `tests` array

## Files Modified
1. `src/domain/entities/lab-test-order.entity.ts`
2. `src/domain/types/labTestAdmin/update-order-status.type.ts`
3. `src/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.interface.ts`
4. `src/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.ts`
5. `src/domain/use-cases/labTestAdmin/update-order-status.use-case.ts`
6. `src/application/controllers/labTestAdmin/update-order-status.controller.ts`

## Files Created
1. `test-labtest-order-status-individual-tests.http` (test file)