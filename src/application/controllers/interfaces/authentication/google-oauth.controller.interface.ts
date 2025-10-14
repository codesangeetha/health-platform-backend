import { Request, Response } from 'express';
import { GoogleOAuthResponse, GoogleOAuthError } from '@/domain/types/authentication/google-oauth.type';

export interface IGoogleOAuthController {
   googleAuth(req: Request, res: Response): Promise<void>;
   googleAuthCallback(req: Request, res: Response): Promise<void>;
   getCurrentUser(req: Request, res: Response): Promise<void>;
   logout(req: Request, res: Response): Promise<void>;
   googleLogout(req: Request, res: Response): Promise<void>;
 }