export interface GetPatientProfileRequest {
  userId: string;
}

export interface GetPatientProfileResponse {
  success: boolean;
  message: string;
  data: {
    patientId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    whatsapp:string;
    dateOfBirth: string | undefined;
    bloodGroup: string | undefined;
    allergies: string[];
    chronicDiseases: string[];
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    } | undefined;
  };
  timestamp: string;
}