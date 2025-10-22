// Medicine type for prescription updates
export interface UpdatePrescriptionMedicine {
    medicineId: string;
    name?: string;
    dosage: string;
    timing: string[];
    duration: number;
    mealTime: 'before meal' | 'after meal' | 'with meal';
}

// Request type for prescription update
export interface UpdatePrescriptionRequest {
    diagnosis?: string;
    notes?: string;
    medicines?: UpdatePrescriptionMedicine[];
    tests?: string[];
    status?: 'Created' | 'Dispensed' | 'Cancelled';
}

// Response type for prescription update
export interface UpdatePrescriptionResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        appointmentId: string;
        doctorId: string;
        patientId: string;
        diagnosis: string;
        notes?: string;
        medicines: UpdatePrescriptionMedicine[];
        tests?: string[];
        status: 'Created' | 'Dispensed' | 'Cancelled';
        createdAt: string;
        updatedAt: string;
    };
}