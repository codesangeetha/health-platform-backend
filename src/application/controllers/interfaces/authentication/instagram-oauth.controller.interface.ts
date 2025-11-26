import { Request, Response } from 'express';
import { InstagramOAuthSuccess, InstagramOAuthError } from '@/domain/types/authentication/instagram-oauth.type';

export interface IInstagramOAuthController {
  instagramAuth(req: Request, res: Response): Promise<void>;
  instagramAuthCallback(req: Request, res: Response): Promise<void>;
}