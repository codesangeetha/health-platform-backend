export interface UserRegistrationRequest {
  userType: 'patient' | 'doctor';
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp: string;
  dateOfBirth: string;
  password?: string; // Optional for doctors, required for patients
}

export interface PatientRegistrationRequest extends UserRegistrationRequest {
  userType: 'patient';
  password: string; // Required for patients
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
  password?: string; // Optional for doctors - will receive setup link via email
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
    isActive: boolean;
  };
}