// Response type for get prescription by ID
export interface GetPrescriptionResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        appointmentId: string;
        doctorId: string;
        patientId: string;
        diagnosis: string;
        notes?: string;
        medicines: Array<{
            medicineId: string;
            name?: string;
            dosage: string;
            timing: string[];
            duration: number;
            mealTime: 'before meal' | 'after meal' | 'with meal';
        }>;
        tests?: string[];
        status: 'Created' | 'Dispensed' | 'Cancelled';
        createdAt: string;
        updatedAt: string;
    };
}