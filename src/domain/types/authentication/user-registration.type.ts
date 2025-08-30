export interface UserRegistrationRequest {
  userType: 'patient' | 'doctor';
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

export interface DoctorRegistrationRequest extends UserRegistrationRequest {
  userType: 'doctor';
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