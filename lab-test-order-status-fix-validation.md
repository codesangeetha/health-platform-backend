### Lab Test Order Status Individual Tests - Fix Validation

#### Test Case: Individual Test Status Update

**Request:**
```json
{
  "status": "completed",
  "reason": "Order completed",
  "result": [
    {
        "labTestId": "690708e591b451d45062dc4b",
        "testStatus": "skipped",
        "testResult": null
    },
    {
        "labTestId": "6908ce109d564e4d6c2e003c",
        "testStatus": "completed",
        "testResult": "5.3 million cells/mcL (Normal range: 4.5-6.0)"
    }
  ]
}
```

**Expected Response:**
```json
{
    "success": true,
    "message": "Lab test order status updated successfully",
    "timestamp": "2025-12-05T09:51:49.045Z",
    "data": {
        "orderId": "LAB_1764582066150_510",
        "status": "completed",
        "items": [
            {
                "labTestId": "690708e591b451d45062dc4b",
                "quantity": 1,
                "price": 250,
                "result": null,
                "testStatus": "skipped"
            },
            {
                "labTestId": "6908ce109d564e4d6c2e003c",
                "quantity": 1,
                "price": 400,
                "result": "5.3 million cells/mcL (Normal range: 4.5-6.0)",
                "testStatus": "completed"
            }
        ],
        "totalAmount": 400,
        "updatedAt": "2025-12-05T09:51:48.951Z",
        "reason": "Order completed"
    }
}
```

### Fixes Applied

1. **Repository Update Logic**: Enhanced the `updateStatusWithIndividualTests` method to:
   - Properly match labTestId values between database and request
   - Ensure testStatus and testResult are correctly updated for each individual test
   - Calculate totalAmount correctly based on non-skipped tests

2. **Response Building**: Improved the response building in the use case to:
   - Explicitly preserve the testStatus values from the database
   - Ensure proper labTestId string conversion
   - Handle edge cases for missing values

### Key Changes Made

#### 1. Repository Fix (`lab-test-order-repository.ts`)
- **Enhanced ID Matching**: Added multiple matching strategies to ensure labTestId values match correctly
- **Improved Total Calculation**: Moved total calculation into the main mapping loop for accuracy
- **Better Result Handling**: Properly handle testResult field preservation and updates

#### 2. Use Case Response Fix (`update-order-status.use-case.ts`)
- **Explicit testStatus Handling**: Ensured testStatus is explicitly set from database values
- **Better Error Handling**: Added safeguards for missing labTestId values

### Validation Steps

1. Start the application server
2. Execute the curl command with the exact payload provided
3. Verify that the response shows the correct testStatus values:
   - First item: `"testStatus": "skipped"`
   - Second item: `"testStatus": "completed"`
4. Verify that the result field is correctly set:
   - First item: `"result": null`
   - Second item: `"result": "5.3 million cells/mcL (Normal range: 4.5-6.0)"`
5. Verify that the totalAmount reflects only non-skipped tests: `400` (250 + 400, but 250 is skipped so only 400)

### API Endpoint
```bash
curl --location --request PUT 'http://localhost:3000/api/v1/lab-test-orders/LAB_1764582066150_510/status' \
--header 'Authorization: Bearer [ADMIN_TOKEN]' \
--header 'Content-Type: application/json' \
--data '{
  "status": "completed",
  "reason": "Order completed", 
  "result": [
    {
        "labTestId": "690708e591b451d45062dc4b",
        "testStatus": "skipped",
        "testResult": null
    },
    {
        "labTestId": "6908ce109d564e4d6c2e003c",
        "testStatus": "completed",
        "testResult": "5.3 million cells/mcL (Normal range: 4.5-6.0)"
    }
  ]
}'