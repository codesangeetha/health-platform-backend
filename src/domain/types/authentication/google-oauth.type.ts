export interface GoogleOAuthRequest {
  accessToken: string;
  refreshToken?: string;
  profile: GoogleProfile;
}

export interface GoogleProfile {
  id: string;
  displayName: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: Array<{
    value: string;
    verified: boolean;
  }>;
  photos: Array<{
    value: string;
  }>;
  provider: string;
}

export interface GoogleOAuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    isActive: boolean;
    userType: 'patient' | 'doctor' | 'admin';
  };
  token?: string;
}

export interface GoogleOAuthError {
  success: false;
  message: string;
  error: string;
}