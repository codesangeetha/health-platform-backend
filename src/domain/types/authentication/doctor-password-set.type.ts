export interface DoctorPasswordSetRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DoctorPasswordSetResponse {
  success: boolean;
  message: string;
}