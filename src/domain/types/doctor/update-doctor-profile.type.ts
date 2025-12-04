export interface UpdateDoctorProfileRequest {
    firstName: string,
    lastName: string,
    phone: string,
    specialization: string,
    licenseNumber: string,
    experience: string,
    consultationFee: number,
    qualification: string,
    hospital?: string,
    availableDays: string[],
    availableTime: {
        start: string,
        end: string,
    } | undefined,
    rating: number
}

export interface UpdateDoctorProfileResponse {
    success: boolean,
    message: string,
    data: {
        doctorId: string,
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
    },
    timestamp: string,
}

