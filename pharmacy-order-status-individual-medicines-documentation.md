# Pharmacy Order Status Update - Individual Medicines Support

## Overview

The Pharmacy Order Status Update API has been enhanced to support individual medicine status updates within an order, similar to the lab test order functionality. This allows pharmacy admins to complete or skip individual medicines and automatically recalculate the total order amount based on the medicines that were completed.

## Key Features

### 1. Individual Medicine Status Updates
- Each medicine in an order can be marked as `completed` or `skipped`
- Only completed medicines contribute to the total order amount
- Skipped medicines are excluded from the final price calculation

### 2. Automatic Status Determination
- **All medicines skipped** → Order status becomes `cancelled`
- **At least one medicine completed** → Order status becomes `completed`
- **No medicines updated** → Order status remains as requested or `pending`

### 3. Backward Compatibility
- Legacy format (without individual medicine updates) still works
- Existing orders continue to function without modification

## API Specification

### Endpoint
```
PUT /api/v1/pharmacy/orders/:orderId/status
```

### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Request Body Formats

#### New Format (Individual Medicine Updates)
```json
{
  "status": "completed",
  "reason": "Some items not available in stock",
  "medicines": [
    {
      "medicineId": "6764f5e7a7c28d7b4a123456",
      "itemStatus": "completed"
    },
    {
      "medicineId": "6764f5e7a7c28d7b4a789012",
      "itemStatus": "skipped"
    },
    {
      "medicineId": "6764f5e7a7c28d7b4a345678",
      "itemStatus": "completed"
    }
  ]
}
```

#### Legacy Format (Still Supported)
```json
{
  "status": "completed",
  "reason": "Order shipped via courier"
}
```

### Response Format

#### Success Response (Individual Medicine Updates)
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "timestamp": "2025-12-05T11:16:12.863Z",
  "data": {
    "orderId": "ORD_1763880889355_476",
    "status": "completed",
    "reason": "Some items not available in stock",
    "items": [
      {
        "medicineId": "6764f5e7a7c28d7b4a123456",
        "medicineName": "Paracetamol 500mg",
        "quantity": 2,
        "price": 50.00,
        "itemStatus": "completed"
      },
      {
        "medicineId": "6764f5e7a7c28d7b4a789012",
        "medicineName": "Aspirin 75mg",
        "quantity": 1,
        "price": 30.00,
        "itemStatus": "skipped"
      },
      {
        "medicineId": "6764f5e7a7c28d7b4a345678",
        "medicineName": "Vitamin D3",
        "quantity": 1,
        "price": 120.00,
        "itemStatus": "completed"
      }
    ],
    "totalAmount": 170.00,
    "updatedAt": "2025-12-05T11:16:12.555Z"
  }
}
```

#### Success Response (Legacy Format)
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "timestamp": "2025-12-05T11:16:12.863Z",
  "data": {
    "orderId": "ORD_1763880889355_476",
    "status": "completed",
    "items": [...],
    "totalAmount": 200.00,
    "updatedAt": "2025-12-05T11:16:12.555Z"
  }
}
```

## Business Logic

### Price Calculation
- **Total Amount** = Sum of prices for all medicines with `itemStatus = "completed"`
- **Skipped medicines** are excluded from the total calculation
- **Formula**: `totalAmount = Σ(price × quantity) for all items where itemStatus ≠ "skipped"`

### Order Status Determination
1. **All medicines skipped**: Order status automatically becomes `cancelled`
2. **At least one medicine completed**: Order status becomes `completed`
3. **No medicines provided in request**: Uses the status from request body
4. **Mixed completion**: At least one `completed` triggers `completed` status

### Validation Rules
- Each medicine update must have `medicineId` and `itemStatus`
- `itemStatus` must be either `"completed"` or `"skipped"`
- All `medicineId` values must exist in the order
- Legacy format validation remains unchanged

## Database Changes

### Schema Updates
- `items[].itemStatus` field added to `MedicineOrderItem` with enum `['pending', 'completed', 'skipped']`
- `reason` field added to `MedicineOrder` for storing cancellation/update reasons
- Backward compatible with existing orders (defaults to `'pending'`)

### New Repository Method
- `updateStatusWithIndividualMedicines()` method added to `IMedicineOrderRepository`
- Handles individual medicine status updates and price recalculation
- Maintains consistency with existing data

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Each medicine update must have medicineId and itemStatus",
  "timestamp": "2025-12-05T11:16:12.863Z"
}
```

### Order Not Found
```json
{
  "success": false,
  "message": "Order not found",
  "timestamp": "2025-12-05T11:16:12.863Z"
}
```

## Example Scenarios

### Scenario 1: Partial Completion
**Order**: 3 medicines totaling $200
**Action**: Complete 2 medicines ($150), skip 1 medicine ($50)
**Result**: 
- Order status: `completed`
- Total amount: $150
- 2 medicines marked as `completed`
- 1 medicine marked as `skipped`

### Scenario 2: Complete Cancellation
**Order**: 3 medicines totaling $200
**Action**: Skip all 3 medicines
**Result**:
- Order status: `cancelled`
- Total amount: $0
- All 3 medicines marked as `skipped`

### Scenario 3: Full Completion
**Order**: 3 medicines totaling $200
**Action**: Complete all 3 medicines
**Result**:
- Order status: `completed`
- Total amount: $200
- All 3 medicines marked as `completed`

## Implementation Benefits

1. **Inventory Management**: Only reduce stock for completed medicines
2. **Pricing Accuracy**: Automatically calculate correct amounts for partial orders
3. **Customer Satisfaction**: Clear indication of which medicines were skipped
4. **Audit Trail**: Track individual medicine status changes
5. **Flexibility**: Support both individual and bulk order updates
6. **Backward Compatibility**: Existing integrations continue to work

## Testing

Use the provided HTTP test file `test-pharmacy-order-status-individual-medicines.http` to test various scenarios:

1. Partial completion with mixed statuses
2. Complete cancellation (all skipped)
3. Full completion (all completed)
4. Legacy format compatibility

## Migration Notes

- Existing orders will automatically get `itemStatus = 'pending'` for all items
- The `reason` field is optional and will be `null` for existing orders
- No database migration required as fields have default values
- API is immediately backward compatible