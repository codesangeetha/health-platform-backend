export interface EditPatientByAdminRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    bloodGroup?: string;
    allergies?: string[];
    chronicDiseases?: string[];
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
}

export interface EditPatientByAdminResponse {
    success: boolean;
    message: string;
    data: {
        patientId: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        whatsapp?: string;
        updatedFields: string[];
    };
    timestamp: string;
}