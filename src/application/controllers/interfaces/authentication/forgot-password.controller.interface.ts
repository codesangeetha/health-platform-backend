import { Request, Response } from 'express';
import { ForgotPasswordRequest } from '@/domain/types/authentication/forgot-password.type';

export interface IForgotPasswordController {
  forgotPassword(req: Request, res: Response): Promise<void>;
}