# Fix 404 Error for Lab Test Order by ID API

## Step 1: Restart the Server
After making code changes, the server needs to be restarted to pick up the new routes.

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
# or
npm start
```

## Step 2: Verify Route Registration
Check if the new route is properly registered by looking at the console logs when the server starts.

## Step 3: Test Route Accessibility
Use the debug file: `debug-labtest-order-by-id.http`

## Step 4: Check Order ID Existance
The order `LAB_1764571923653_793` might not exist in the database. 

### First, get existing order IDs:
```bash
# Test the list endpoint to see existing orders
GET /api/v1/pharmacy/lab-tests/orders
```

### Then use one of those order IDs to test the by-ID endpoint.

## Step 5: Alternative Solution - Use findById instead of findByOrderId

If the issue persists, we can modify the implementation to use `findById` (MongoDB ObjectId) instead of `findByOrderId` (custom orderId field).

## Step 6: Debug Authentication
Make sure the user token belongs to a user who has access to that specific order.

## Common Order ID Formats:
- MongoDB ObjectId: `507f1f77bcf86cd799439011`
- Custom OrderId: `ORD-123456789`, `LAB_1764571923653_793`

## Testing Strategy:
1. Restart server
2. Get list of orders using `/lab-tests/orders`
3. Use one of the actual order IDs from the response
4. Test `/lab-test-orders/{actualOrderId}`