# Lab Test Order Status Update API - FIXED VERSION

## Issues Identified and Fixed

### Original Problem
The user's test showed several issues with the initial implementation:
1. Items were not getting their `testStatus` updated (still showing "pending")
2. Total amount was not recalculated correctly (showing 650 instead of 250)
3. The system wasn't properly detecting mixed-format requests

### Fixes Implemented

#### 1. Enhanced Format Detection
**File:** `src/domain/use-cases/labTestAdmin/update-order-status.use-case.ts`

Added logic to detect when a `result` array contains `testStatus` fields and convert it to the new format automatically:

```typescript
// Check if result array contains testStatus fields (new format using result field)
if (Array.isArray(request.result) && request.result.length > 0 && (request.result[0] as any).testStatus) {
    // Convert result array to tests format for processing
    const testsFromResult = request.result.map((item: any) => ({
        labTestId: item.labTestId,
        testStatus: item.testStatus,
        testResult: item.testResult
    }));
    
    const convertedRequest = {
        ...request,
        tests: testsFromResult
    };
    return this.handleIndividualTestUpdates(existingOrder, convertedRequest);
}
```

#### 2. Improved Validation for Skipped Tests
Updated validation to accept both `null` and `"skipped"` as valid result values for skipped tests:

```typescript
// If testStatus is 'skipped', testResult should be null or "skipped"
if (testUpdate.testStatus === 'skipped' && testUpdate.testResult && testUpdate.testResult !== 'skipped') {
    throw new AppError('testResult should be null or "skipped" when testStatus is "skipped"', 'INVALID_TEST_RESULT_FOR_SKIPPED', 400);
}
```

#### 3. Normalized Response Handling
Added logic to normalize `"skipped"` results to `null` for consistency in responses:

```typescript
items: updatedOrder.items.map((item: any) => {
    let result = item.result || undefined;
    // Normalize "skipped" result to null for consistency
    if (result === 'skipped') {
        result = null;
    }
    
    return {
        labTestId: item.labTestId.toString(),
        labTestName: item.labTestName,
        quantity: item.quantity,
        price: item.price || 0,
        result: result,
        testStatus: item.testStatus || 'pending'
    };
}),
```

## Supported Formats

### Format 1: Using "tests" field (Recommended)
```json
{
  "status": "completed",
  "reason": "Mixed results",
  "tests": [
    {
      "labTestId": "ID1",
      "testStatus": "completed",
      "testResult": "Result text"
    },
    {
      "labTestId": "ID2",
      "testStatus": "skipped",
      "testResult": null
    }
  ]
}
```

### Format 2: Using "result" array with testStatus (Backward Compatible)
```json
{
  "status": "completed",
  "reason": "Order completed",
  "result": [
    {
        "labTestId": "690708e591b451d45062dc4b",
        "testStatus": "completed",
        "testResult": "5.3 million cells/mcL"
    },
    {
        "labTestId": "6908ce109d564e4d6c2e003c",
        "testStatus": "skipped",
        "testResult": "skipped"
    }
  ]
}
```

### Format 3: Legacy format (Still Supported)
```json
{
  "status": "completed",
  "reason": "Order completed",
  "result": "All tests completed successfully"
}
```

## Expected Response After Fix
For the user's test case with mixed completed/skipped tests:

```json
{
    "success": true,
    "message": "Lab test order status updated successfully",
    "timestamp": "2025-12-05T07:35:57.817Z",
    "data": {
        "orderId": "LAB_1764582066150_510",
        "status": "completed",
        "reason": "Order completed",
        "items": [
            {
                "labTestId": "690708e591b451d45062dc4b",
                "labTestName": "Fasting Blood Sugar (FBS)",
                "quantity": 1,
                "price": 250,
                "result": "5.3 million cells/mcL (Normal range: 4.5-6.0)",
                "testStatus": "completed"
            },
            {
                "labTestId": "6908ce109d564e4d6c2e003c",
                "labTestName": "Kidney Function Test (KFT)",
                "quantity": 1,
                "price": 400,
                "result": null,
                "testStatus": "skipped"
            }
        ],
        "totalAmount": 250,
        "updatedAt": "2025-12-05T07:35:57.817Z"
    }
}
```

Note the key differences:
- ✅ `testStatus` is now properly updated for each item
- ✅ `totalAmount` is recalculated to 250 (only the non-skipped test)
- ✅ `result` for skipped test is normalized to `null`

## Testing
Updated test file: `test-labtest-order-status-fixed.http`
- Test 1: Using result array with testStatus fields (the format you used)
- Test 2: Using new "tests" format (recommended approach)
- Test 3: All tests skipped (cancelled status)
- Test 4: Legacy format compatibility

## Key Improvements
1. **Automatic Format Detection** - System detects mixed formats and processes correctly
2. **Proper Test Status Updates** - Individual test statuses are now properly applied
3. **Accurate Price Calculation** - Total is recalculated based on non-skipped tests only
4. **Flexible Result Handling** - Accepts both `null` and `"skipped"` for skipped test results
5. **Normalized Responses** - Ensures consistent response format
6. **Full Backward Compatibility** - All existing formats continue to work