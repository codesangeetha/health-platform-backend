// Medicine type for prescription creation
export interface CreatePrescriptionMedicine {
    medicineId: string;
    name?: string;  // Optional - can be populated from medicine collection
    dosage: string;
    timing: string[];
    duration: number;
    mealTime: 'before meal' | 'after meal' | 'with meal';
}

// Request type for prescription creation
export interface CreatePrescriptionRequest {
    appointmentId: string;
    patientId: string;
    diagnosis: string;
    notes?: string;
    medicines: CreatePrescriptionMedicine[];
    tests?: string[];
}

// Response type for prescription creation
export interface CreatePrescriptionResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        appointmentId: string;
        doctorId: string;
        patientId: string;
        status: string;
    };
}