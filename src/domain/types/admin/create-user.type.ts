// Request type for creating a doctor user
export interface CreateUserRequest {
  userType: 'doctor'|'patient';
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  specialization: string;
  qualification: string;
  hospital: string;
  licenseNumber: string;
  experience: string;        // can also be number if you prefer
  consultationFee: number;
}

// Generic response type for user creation
export interface CreateUserResponse {
  success: boolean;
  message: string;
  timestamp: string; // ISO date string
  data: {
    userId: string;
    email: string;
    userType: 'doctor' | 'patient';
  };
}
