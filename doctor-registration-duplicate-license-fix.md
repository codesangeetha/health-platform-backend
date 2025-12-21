# Doctor Registration Duplicate License Number Error Fix

## Problem
When registering a doctor with a duplicate license number, the API was returning a generic "Internal server error" instead of a user-friendly validation message.

**Error Response Before Fix:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "INTERNAL_SERVER_ERROR"
}
```

**Actual MongoDB Error:**
```json
{
  "errorResponse": {
    "index": 0,
    "code": 11000,
    "errmsg": "E11000 duplicate key error collection: health-platform.doctors index: licenseNumber_1 dup key: { licenseNumber: 'MED123453' }",
    "keyPattern": { "licenseNumber": 1 },
    "keyValue": { "licenseNumber": "MED123453" }
  }
}
```

## Solution
Implemented proper validation to check for duplicate license numbers before attempting to create the doctor record, and enhanced error handling to provide user-friendly messages.

### Changes Made

#### 1. Updated UserRepository Interface
**File:** `src/domain/use-cases/interfaces/authentication/user-repository.interface.ts`

Added `findByLicenseNumber` method to the interface:
```typescript
export interface IUserRepository {
  // ... existing methods
  findByLicenseNumber(licenseNumber: string): Promise<any>;
}
```

#### 2. Implemented findByLicenseNumber Method
**File:** `src/infrastructure/driven-adapters/database/mongodb/repositories/user-repository.ts`

Added the implementation:
```typescript
async findByLicenseNumber(licenseNumber: string): Promise<any> {
  // License numbers are only for doctors, so we only search in DoctorModel
  return await DoctorModel.findOne({ licenseNumber }).lean();
}
```

#### 3. Added Duplicate License Check in Registration Use Case
**File:** `src/domain/use-cases/authentication/register-user.use-case.ts`

Added validation before doctor creation:
```typescript
// Check for duplicate license number for doctors
if (request.userType === 'doctor') {
  const doctorRequest = request as DoctorRegistrationRequest;
  const existingLicenseDoctor = await this.userRepository.findByLicenseNumber(doctorRequest.licenseNumber);
  if (existingLicenseDoctor) {
    throw new AppError('License number already exists', 'USER_004', 409);
  }
}
```

#### 4. Enhanced Error Handling in Controller
**File:** `src/application/controllers/authentication/register-user.controller.ts`

Added MongoDB duplicate key error handling:
```typescript
} else if (typeof error === 'object' && error !== null && 'name' in error && 'code' in error && 
          error.name === 'MongoServerError' && error.code === 11000) {
  // Handle MongoDB duplicate key errors
  const mongoError = error as any;
  let errorMessage = 'Duplicate value found';
  let errorCode = 'DUPLICATE_VALUE';
  
  // Check which field is duplicated
  if (mongoError.keyPattern?.email) {
    errorMessage = 'Email already exists';
    errorCode = 'EMAIL_EXISTS';
  } else if (mongoError.keyPattern?.phone) {
    errorMessage = 'Phone number already exists';
    errorCode = 'PHONE_EXISTS';
  } else if (mongoError.keyPattern?.licenseNumber) {
    errorMessage = 'License number already exists';
    errorCode = 'LICENSE_EXISTS';
  }
  
  res.status(409).json({
    success: false,
    message: errorMessage,
    error: errorCode
  });
}
```

## Result

### After Fix - Proper Error Response
```json
{
  "success": false,
  "message": "License number already exists",
  "error": "LICENSE_EXISTS"
}
```

### Benefits
1. **User-Friendly Messages**: Users now get clear, actionable error messages instead of generic server errors
2. **Early Validation**: Duplicate license numbers are caught before attempting database operations
3. **Consistent Error Handling**: All duplicate field errors now follow the same pattern
4. **Better UX**: Users understand exactly what needs to be corrected

## Testing
Created test file: `test-doctor-registration-duplicate-license.http`

The fix ensures that when the same license number (MED123453) is used again, users receive a proper validation message: "License number already exists" with error code "LICENSE_EXISTS" instead of the confusing "Internal server error".

## Error Codes Used
- `USER_004`: License number already exists (in use case validation)
- `LICENSE_EXISTS`: License number already exists (MongoDB error fallback)

Both return HTTP 409 Conflict status code indicating a duplicate resource.