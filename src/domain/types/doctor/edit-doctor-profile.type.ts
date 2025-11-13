export interface EditDoctorProfileRequest {
    firstName?: string;
    lastName?: string;
    phone?: string;
    whatsapp?: string;
    specialization?: string;
    licenseNumber?: string;
    experience?: string;
    consultationFee?: number;
    qualification?: string;
    hospital?: string;
    availableDays?: string[];
    availableTime?: {
        start: string;
        end: string;
    };
    rating?: number;
    isActive?: boolean;
}

export interface EditDoctorProfileResponse {
    success: boolean;
    message: string;
    data: {
        doctorId: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        updatedFields: string[];
    };
    timestamp: string;
}