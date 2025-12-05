# Appointment Conflict Error Handling Fix

## Problem
When trying to book an appointment for the same doctor at the same date and time, the system was showing a generic MongoDB database error instead of a user-friendly message explaining the issue.

### Original Error Response:
```json
{
    "success": false,
    "message": "Database error",
    "error": "DATABASE_ERROR"
}
```

## Solution Implemented

### 1. Enhanced Error Detection in Appointment Repository

Modified `src/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository.ts` to detect the specific MongoDB duplicate key error and provide contextual information.

#### Key Changes:
- Detect MongoDB error code 11000 (duplicate key)
- Extract the conflicting date and time from the error details
- Format the date in a user-friendly format
- Throw a specific `AppError` with meaningful message and appropriate HTTP status code

### 2. User-Friendly Error Messages

The fix now provides two types of specific error messages:

#### A. Date/Time Conflict (Most Common)
```json
{
    "success": false,
    "message": "This appointment slot is already booked. Please choose a different date or time. September 25, 2025 at 11:25 is not available.",
    "error": "APPOINTMENT_SLOT_CONFLICT"
}
```

#### B. Generic Duplicate Error
```json
{
    "success": false,
    "message": "An appointment with this information already exists. Please check your details and try again.",
    "error": "APPOINTMENT_DUPLICATE"
}
```

### 3. HTTP Status Codes
- `409 Conflict` - For appointment slot conflicts and duplicate appointments
- `500 Internal Server Error` - For other database errors

## Technical Details

### Error Detection Logic:
```typescript
if (error?.code === 11000) {
    // Check if this is a date/time conflict (compound index)
    if (error?.keyPattern?.date === 1 && error?.keyPattern?.time === 1) {
        // Extract and format the conflicting date and time
        // Throw specific appointment slot conflict error
    }
    // Otherwise throw generic duplicate appointment error
}
```

### Date Formatting:
- Converts MongoDB date format to user-friendly string
- Uses locale-specific formatting for better user experience
- Handles date parsing errors gracefully

## Testing

Created `test-appointment-conflict-handling.http` file to test:
1. Successful appointment booking
2. Conflict error when booking same slot
3. Successful booking of different time slot

## Benefits

1. **Better User Experience**: Clear, actionable error messages
2. **Improved Error Handling**: Specific error codes for different scenarios
3. **Proper HTTP Status Codes**: 409 for conflicts, 500 for other database errors
4. **Backward Compatibility**: Other database errors still return generic messages
5. **Comprehensive Coverage**: Works for both booking new appointments and rescheduling

## Files Modified

1. **appointment-repository.ts**: Enhanced duplicate key error handling
2. **test-appointment-conflict-handling.http**: Created test scenarios

## Error Flow

1. User attempts to book appointment
2. MongoDB detects duplicate key (same doctor, date, time)
3. Repository catches the error and extracts conflict details
4. Repository throws `AppError` with user-friendly message
5. Controller catches the `AppError` and returns proper HTTP response
6. Frontend receives clear error message to display to user

This fix ensures users understand exactly why their appointment booking failed and what they can do to resolve the issue.