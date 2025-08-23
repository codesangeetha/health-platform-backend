export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      userId: string;
      email: string;
      userType: 'patient' | 'doctor' | 'admin';
    };
  };
}