export interface InstagramOAuthRequest {
  code: string;
  redirect_uri: string;
}

export interface InstagramProfile {
  id: string;
  username: string;
  profile_picture_url: string;
  access_token: string;
}

export interface InstagramOAuthResponse {
  access_token: string;
  user_id: string;
}

export interface InstagramTokenExchangeRequest {
  client_id: string;
  client_secret: string;
  grant_type: 'authorization_code';
  redirect_uri: string;
  code: string;
}

export interface InstagramTokenExchangeResponse {
  access_token: string;
  user_id: string;
}

export interface InstagramUserProfile {
  id: string;
  username: string;
  profile_picture_url: string;
}

export interface InstagramOAuthSuccess {
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

export interface InstagramOAuthError {
  success: false;
  message: string;
  error: string;
}