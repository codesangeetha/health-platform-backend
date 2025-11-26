# Pharmacy Order Status Update API Documentation

## Overview
This document describes the API for updating pharmacy order status. The API allows authorized users (admin role) to update the status of medicine orders.

## Endpoint Details

### **PUT /api/v1/pharmacy/orders/:orderId/status**

Updates the status of a pharmacy order.

**URL:** `http://localhost:3000/api/v1/pharmacy/orders/{orderId}/status`

**Authentication:** Required (JWT Bearer token with admin role)

**Content-Type:** `application/json`

### Request Body

```json
{
  "status": "completed",
  "reason": "Order completed successfully"
}
```

**Parameters:**
- `status` (string, required): New status for the order
- `reason` (string, optional): Reason for the status change

**Valid Status Values:**
- `pending` - Order received, awaiting processing
- `completed` - Order has been completed
- `cancelled` - Order has been cancelled

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "timestamp": "2025-11-26T12:17:46.620Z",
  "data": {
    "orderId": "68cfcb8e5ffb0bf425a65cbc",
    "status": "completed",
    "reason": "Order completed successfully",
    "updatedAt": "2025-11-26T12:17:46.620Z"
  }
}
```

### Error Responses

**400 Bad Request** - Invalid input
```json
{
  "success": false,
  "message": "Status is required",
  "error": "INVALID_INPUT"
}
```

**404 Not Found** - Order not found
```json
{
  "success": false,
  "message": "Order not found",
  "error": "ORDER_NOT_FOUND"
}
```

**401 Unauthorized** - Missing/invalid authentication
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "UNAUTHORIZED"
}
```

## Implementation Details

### Files Created/Modified

#### 1. Type Definitions
- **File:** [`src/domain/types/pharmacyAdmin/update-order-status.type.ts`](src/domain/types/pharmacyAdmin/update-order-status.type.ts)
- **Purpose:** TypeScript interfaces for request/response
- **Valid Statuses:** `pending`, `completed`, `cancelled`

#### 2. Use Case Layer
- **Interface:** [`src/domain/use-cases/interfaces/pharmacyAdmin/update-order-status.use-case.interface.ts`](src/domain/use-cases/interfaces/pharmacyAdmin/update-order-status.use-case.interface.ts)
- **Implementation:** [`src/domain/use-cases/pharmacyAdmin/update-order-status.use-case.ts`](src/domain/use-cases/pharmacyAdmin/update-order-status.use-case.ts)
- **Purpose:** Business logic for order status updates
- **Validation:** Only allows `pending`, `completed`, `cancelled` status values

#### 3. Controller Layer
- **Interface:** [`src/application/controllers/interfaces/pharmacyAdmin/update-order-status.controller.interface.ts`](src/application/controllers/interfaces/pharmacyAdmin/update-order-status.controller.interface.ts)
- **Implementation:** [`src/application/controllers/pharmacyAdmin/update-order-status.controller.ts`](src/application/controllers/pharmacyAdmin/update-order-status.controller.ts)
- **Purpose:** HTTP request handling

#### 4. Route Configuration
- **File:** [`src/infrastructure/entry-points/api/routes/pharmacyAdmin.route.ts`](src/infrastructure/entry-points/api/routes/pharmacyAdmin.route.ts)
- **Purpose:** Express route registration

#### 5. Dependency Injection
- **File:** [`src/infrastructure/entry-points/api/container.ts`](src/infrastructure/entry-points/api/container.ts)
- **Purpose:** Register dependencies and inject controllers

#### 6. Testing
- **Integration Test:** [`test/integration/pharmacy/update-order-status.integration.spec.ts`](test/integration/pharmacy/update-order-status.integration.spec.ts)
- **HTTP Examples:** [`test-pharmacy-order-status-update.http`](test-pharmacy-order-status-update.http)

### Architecture Pattern

The implementation follows the **Clean Architecture** pattern:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controller    │────│   Use Case      │────│  Repository     │
│  (HTTP Layer)   │    │ (Business Logic)│    │  (Database)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

1. **Controller**: Handles HTTP requests, validation, and responses
2. **Use Case**: Contains business logic and validation
3. **Repository**: Database operations (already existed)

### Security Features

- **JWT Authentication**: Required for all requests
- **Role-based Authorization**: Admin role only
- **Input Validation**: Status field validation
- **Error Handling**: Comprehensive error responses

## Testing

### Unit Testing
The use case and controller can be unit tested independently.

### Integration Testing
Complete end-to-end testing available in:
- [`test/integration/pharmacy/update-order-status.integration.spec.ts`](test/integration/pharmacy/update-order-status.integration.spec.ts)

### Manual Testing
Use the HTTP test file: [`test-pharmacy-order-status-update.http`](test-pharmacy-order-status-update.http)

### Running Tests
```bash
# Run specific test
npm test -- --grep "Update Pharmacy Order Status"

# Run all tests
npm test
```

## Usage Examples

### Update to Completed
```bash
curl -X PUT \
  http://localhost:3000/api/v1/pharmacy/orders/68cfcb8e5ffb0bf425a65cbc/status \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "completed",
    "reason": "Order completed successfully"
  }'
```

### Update to Pending
```bash
curl -X PUT \
  http://localhost:3000/api/v1/pharmacy/orders/68cfcb8e5ffb0bf425a65cbc/status \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "pending",
    "reason": "Order set back to pending"
  }'
```

### Update to Cancelled
```bash
curl -X PUT \
  http://localhost:3000/api/v1/pharmacy/orders/68cfcb8e5ffb0bf425a65cbc/status \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "cancelled",
    "reason": "Order cancelled by pharmacy"
  }'
```

## Dependencies

The implementation reuses existing database functionality:
- `MedicineOrderRepository.updateStatus()` method already existed
- JWT authentication middleware
- Role-based authorization middleware

## Future Enhancements

1. **Audit Trail**: Log all status changes
2. **Notifications**: Send notifications when status changes
3. **Bulk Updates**: Support updating multiple orders
4. **Status History**: Track status change history
5. **Conditional Updates**: Update only if status transition is valid

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_INPUT` | Missing required fields |
| `INVALID_STATUS` | Invalid status value |
| `ORDER_NOT_FOUND` | Order ID not found |
| `UPDATE_FAILED` | Database update failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |

## Status Flow

The API supports the following simplified status flow:

```
pending → completed
pending → cancelled
completed → cancelled
cancelled → pending
```

**Note:** Status transitions are not restricted in the current implementation. Business rules for status transitions can be added as needed.

---

**Implementation Date:** November 26, 2025  
**API Version:** v1  
**Author:** Health Platform Backend Team  
**Valid Status Values:** pending, completed, cancelled (updated from original list)