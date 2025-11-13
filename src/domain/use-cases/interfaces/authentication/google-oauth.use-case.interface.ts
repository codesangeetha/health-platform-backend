import { GoogleProfile } from '@/domain/types/authentication/google-oauth.type';

export interface IGoogleOAuthUseCase {
  authenticateWithGoogle(profile: GoogleProfile): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    isActive: boolean;
    userType: 'patient' | 'doctor' | 'admin';
  }>;
  getUserById(id: string): Promise<any>;
}