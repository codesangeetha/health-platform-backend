# Pharmacy Order Stock Reduction Implementation

## Overview
This implementation adds functionality to automatically reduce medicine stock when a pharmacy order status changes to "completed". This ensures inventory is properly managed when orders are fulfilled.

## Changes Made

### 1. Updated UpdateOrderStatusUseCase
**File:** `src/domain/use-cases/pharmacyAdmin/update-order-status.use-case.ts`

**Changes:**
- Added `IMedicineRepository` dependency to the constructor
- Modified the `execute` method to call stock reduction logic when status is "completed"
- Added `reduceMedicineStock` private method that:
  - Iterates through each medicine item in the order
  - Fetches current medicine details to get stock information
  - Calculates new stock (current stock - quantity ordered)
  - Clamps stock to minimum of 0 to prevent negative inventory
  - Updates medicine stock via the repository
  - Includes error handling to prevent stock issues from breaking order status updates

**Key Features:**
- Stock reduction only triggers when status changes to "completed"
- Handles insufficient stock gracefully with warnings
- Ensures stock never goes below 0
- Error logging for debugging without breaking the order flow
- Non-blocking - order status update succeeds even if stock update fails

### 2. Updated Dependency Injection Container
**File:** `src/infrastructure/entry-points/api/container.ts`

**Changes:**
- Modified `UpdateOrderStatusUseCase` instantiation to include `pharmacyMedicineRepository` parameter
- Ensures proper dependency injection for the new functionality

## Usage

### API Endpoint
```http
PUT http://localhost:3000/api/v1/pharmacy/orders/{orderId}/status
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "status": "completed",
  "reason": "Order shipped via courier"
}
```

### Stock Reduction Logic
1. When order status is updated to "completed":
   - System retrieves all medicines in the order
   - For each medicine item:
     - Fetches current stock level
     - Subtracts the ordered quantity
     - Updates the medicine stock (minimum 0)
     - Logs the operation for audit purposes

### Error Handling
- If a medicine is not found: logs warning and continues with other items
- If stock is insufficient: logs warning but sets stock to 0 (not negative)
- If stock update fails: logs error but doesn't prevent order status update

## Testing

### Test File Created
**File:** `test-pharmacy-stock-reduction.http`

The test file includes comprehensive scenarios:
1. **Normal Stock Reduction**: Verifies stock reduces by ordered quantity
2. **Insufficient Stock Handling**: Tests behavior when not enough stock available
3. **Edge Cases**: Tests various error conditions and edge cases
4. **Cleanup**: Includes cleanup steps to remove test data

### Test Scenarios
1. Create medicine with known stock (e.g., 100 units)
2. Create prescription and order for 5 units
3. Verify initial stock
4. Complete order and verify stock reduction to 95 units
5. Test insufficient stock scenario (3 units available, 5 ordered)
6. Verify final stock is 0 (not negative)

### Expected Behavior
- Stock should reduce by the exact quantity ordered
- Stock should never go below 0
- Order status update should succeed even if stock update fails
- Appropriate logging should occur for monitoring

## Monitoring and Logging

The implementation includes console logging for:
- Successful stock reductions
- Insufficient stock warnings
- Medicine not found warnings
- Any errors during stock update process

## Benefits

1. **Automatic Inventory Management**: No manual intervention needed for stock updates
2. **Real-time Tracking**: Stock is reduced immediately when orders are completed
3. **Prevents Overselling**: Stock clamping prevents negative inventory
4. **Audit Trail**: Logging provides traceability of stock changes
5. **Robust Error Handling**: System continues operating even if individual stock updates fail
6. **Non-breaking**: Order completion isn't dependent on successful stock updates

## Future Enhancements

Potential improvements could include:
1. Transaction-based stock updates for better atomicity
2. Stock reservation system during order processing
3. Notifications for low stock alerts
4. Batch processing for multiple order completion
5. Stock movement tracking and reporting
6. Integration with supplier ordering systems for automatic reordering

## Backward Compatibility

The implementation is fully backward compatible:
- Existing APIs continue to work unchanged
- No database schema changes required
- Only affects new order completion operations
- Graceful degradation for edge cases