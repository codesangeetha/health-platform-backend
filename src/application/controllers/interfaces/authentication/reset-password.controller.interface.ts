import { Request, Response } from 'express';
import { ResetPasswordRequest } from '@/domain/types/authentication/reset-password.type';

export interface IResetPasswordController {
  resetPassword(req: Request, res: Response): Promise<void>;
}