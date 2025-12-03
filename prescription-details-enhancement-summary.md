# Prescription Details API Enhancement - Medicine & Lab Test Names

## Overview
Enhanced the prescription details API to include medicine names and lab test names alongside their IDs, providing complete information in a single API response.

## Changes Made

### 1. Response Type Enhancement
**File:** `src/domain/types/prescription/get-prescription-details.type.ts`

- Added optional `name` field to medicine items in prescription medicines array
- Added optional `name` field to lab test items in lab test orders
- Added optional `name` field to medicine items in medicine orders

### 2. Use Case Implementation
**File:** `src/domain/use-cases/prescription/get-prescription-details.use-case.ts`

#### New Dependencies
- `IMedicineRepository` - for fetching medicine details
- `ILabTestRepository` - for fetching lab test details

#### Enhancement Features
- **Helper Functions:** Created `getMedicineName()` and `getLabTestName()` functions to fetch names by ID
- **Prescription Medicines:** Enriched prescription medicines array with corresponding medicine names
- **Lab Test Orders:** Enhanced lab test order items with lab test names
- **Medicine Orders:** Enhanced medicine order items with medicine names
- **Error Handling:** Graceful handling when medicine/lab test names are not found

#### Key Implementation Details
- Used Promise.all for concurrent name resolution
- Optional property syntax for TypeScript strict mode compliance
- Maintained backward compatibility (name field is optional)

### 3. Dependency Injection
**File:** `src/infrastructure/entry-points/api/container.ts`

- Updated `GetPrescriptionDetailsUseCase` instantiation to include:
  - `pharmacyMedicineRepository` (medicine repository)
  - `labTestRepository` (lab test repository)

## API Response Format

### Before Enhancement
```json
{
  "medicines": [
    {
      "medicineId": "6908cbdf9d564e4d6c2dfff1",
      "dosage": "500mg",
      "timing": ["morning"],
      "duration": 1,
      "mealTime": "before meal"
    }
  ],
  "labTestOrders": [
    {
      "items": [
        {
          "labTestId": "690708e591b451d45062dc4b",
          "quantity": 1,
          "price": 250,
          "result": "5.8 million cells/mcL"
        }
      ]
    }
  ],
  "medicineOrders": [
    {
      "items": [
        {
          "medicineId": "6908cbdf9d564e4d6c2dfff1",
          "quantity": 1,
          "price": 12.75
        }
      ]
    }
  ]
}
```

### After Enhancement
```json
{
  "medicines": [
    {
      "medicineId": "6908cbdf9d564e4d6c2dfff1",
      "name": "Aspirin",  // NEW: Medicine name included
      "dosage": "500mg",
      "timing": ["morning"],
      "duration": 1,
      "mealTime": "before meal"
    }
  ],
  "labTestOrders": [
    {
      "items": [
        {
          "labTestId": "690708e591b451d45062dc4b",
          "name": "Complete Blood Count",  // NEW: Lab test name included
          "quantity": 1,
          "price": 250,
          "result": "5.8 million cells/mcL"
        }
      ]
    }
  ],
  "medicineOrders": [
    {
      "items": [
        {
          "medicineId": "6908cbdf9d564e4d6c2dfff1",
          "name": "Aspirin",  // NEW: Medicine name included
          "quantity": 1,
          "price": 12.75
        }
      ]
    }
  ]
}
```

## Benefits

1. **Complete Information:** All relevant details available in single API call
2. **Better UX:** Frontend doesn't need separate calls to resolve IDs to names
3. **Performance:** Efficient concurrent name resolution
4. **Backward Compatibility:** Optional name fields don't break existing consumers
5. **Error Resilience:** Graceful handling when names can't be resolved

## Testing

Created test file: `test-prescription-details-with-names.http`

## Performance Considerations

- **Concurrent Resolution:** Uses Promise.all for parallel name fetching
- **Caching Potential:** Could be enhanced with Redis caching for frequently accessed names
- **Database Optimization:** Consider aggregate queries for multiple IDs if performance becomes an issue

## Future Enhancements

1. **Caching Layer:** Implement Redis caching for medicine/lab test names
2. **Bulk Resolution:** Add bulk API endpoints for resolving multiple IDs
3. **Search Enhancement:** Enable searching by medicine/lab test names
4. **Audit Logging:** Track which names are accessed most frequently