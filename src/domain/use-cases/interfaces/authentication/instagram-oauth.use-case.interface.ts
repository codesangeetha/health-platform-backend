import { InstagramProfile } from '@/domain/types/authentication/instagram-oauth.type';

export interface IInstagramOAuthUseCase {
  authenticateWithInstagram(code: string): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    isActive: boolean;
    userType: 'patient' | 'doctor' | 'admin';
  }>;
  exchangeCodeForToken(code: string): Promise<string>;
  fetchInstagramProfile(accessToken: string): Promise<InstagramProfile>;
  getUserById(id: string): Promise<any>;
}