export interface UserRegistrationRequest {
  userType: 'patient' | 'doctor' | 'admin';
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
}

export interface PatientRegistrationRequest extends UserRegistrationRequest {
  userType: 'patient';
  bloodGroup?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface UserRegistrationResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    userType: string;
    isVerified: boolean;
  };
}