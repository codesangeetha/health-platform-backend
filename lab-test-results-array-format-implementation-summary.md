# Lab Test Results Array Format Implementation Summary

## Overview
This implementation modifies the lab test order status update API to support results as an array of objects with `labTestId` mapping, while maintaining backward compatibility with the legacy string format.

## Changes Made

### 1. Type Definitions (`src/domain/types/labTestAdmin/update-order-status.type.ts`)
- Added `LabTestResultItem` interface with `labTestId` and `testResult` properties
- Updated `LabTestResult` type to support both `string` (legacy) and `LabTestResultItem[]` (new format)
- Updated response type to handle the new format

### 2. Controller (`src/application/controllers/labTestAdmin/update-order-status.controller.ts`)
- Simplified request body parsing to handle both string and array formats
- Removed the old `resultText` variable naming for cleaner code

### 3. Use Case (`src/domain/use-cases/labTestAdmin/update-order-status.use-case.ts`)
- Enhanced validation to handle both formats
- Added `validateResultArray()` method to validate array format and labTestId references
- Added `processResultArray()` method to map results to corresponding order items
- Maintains backward compatibility with string format

### 4. Repository Interface (`src/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.interface.ts`)
- Updated `updateStatusReasonAndResults()` method signature to accept `string | any[]` for result parameter

### 5. Repository Implementation (`src/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.ts`)
- Enhanced `updateStatusReasonAndResults()` method to handle both processed items array and legacy string format
- Automatically detects the format and processes accordingly

### 6. Test File (`test-labtest-order-status-with-array-results.http`)
- Created test file demonstrating the new array format usage

## New Request Format

### Legacy Format (Still Supported)
```json
{
  "status": "completed",
  "reason": "Order completed",
  "result": "5.2 million cells/mcL (Normal range: 4.5-6.0)"
}
```

### New Array Format
```json
{
  "status": "completed",
  "reason": "Order completed",
  "result": [
    {
      "labTestId": "690708e591b451d45062dc4b",
      "testResult": "5.2 million cells/mcL (Normal range: 4.5-6.0)"
    }
  ]
}
```

## Key Features

1. **Backward Compatibility**: The API still accepts and processes the legacy string format
2. **Validation**: Array format validates that all `labTestId` values exist in the order items
3. **Mapping**: Results are automatically mapped to the corresponding lab test items by `labTestId`
4. **Error Handling**: Comprehensive error handling for invalid formats and missing lab test IDs

## API Endpoint
- **Method**: PUT
- **URL**: `/api/v1/lab-test-orders/{orderId}/status`
- **Authorization**: Bearer token required
- **Content-Type**: application/json

## Testing
Use the provided test file `test-labtest-order-status-with-array-results.http` to test the new functionality with the following curl command structure:

```bash
curl --location --request PUT 'http://localhost:3000/api/v1/lab-test-orders/LAB_1763880887001_328/status' \
--header 'Authorization: Bearer {token}' \
--header 'Content-Type: application/json' \
--data '{
  "status": "completed",
  "reason": "Order completed",
  "result": [
    {
      "labTestId": "690708e591b451d45062dc4b",
      "testResult": "5.2 million cells/mcL (Normal range: 4.5-6.0)"
    }
  ]
}'
```

## Implementation Details

### Validation Logic
- Array format validation ensures each result item has both `labTestId` and `testResult`
- Verifies all provided `labTestId` values exist in the order items
- Throws appropriate error messages for invalid data

### Result Mapping Process
- Creates a lookup map of `labTestId` to `testResult`
- Updates each order item with the corresponding result
- Maintains all other item properties (quantity, price, etc.)

### Database Integration
- Repository automatically detects whether result is processed items array or legacy string
- Processes items array directly or applies string to all items as before
- Updates MongoDB document with appropriate structure

This implementation provides a robust, backward-compatible solution for handling lab test results with proper mapping to individual test items.