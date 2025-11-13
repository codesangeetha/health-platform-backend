export interface GetDoctorDetailsRequest {
    doctorId: string;
}

export interface GetDoctorDetailsResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: {
        doctorId: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        whatsapp: string;
        specialization: string;
        licenseNumber: string;
        experience: string;
        consultationFee: number;
        qualification: string;
        hospital: string;
        availableDays: string[];
        availableTime: {
            start: string;
            end: string;
        } | undefined;
        rating: number;
        totalPatients: number;
        isActive: boolean;
    };
}