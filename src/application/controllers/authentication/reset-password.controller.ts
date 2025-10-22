import { Request, Response } from 'express';
import { IResetPasswordController } from '../interfaces/authentication/reset-password.controller.interface';
import { IResetPasswordUseCase } from '@/domain/use-cases/interfaces/authentication/reset-password.use-case.interface';
import { ResetPasswordRequest } from '@/domain/types/authentication/reset-password.type';
import { AppError } from '@/shared/errors/app-error';

export class ResetPasswordController implements IResetPasswordController {
  constructor(
    private readonly resetPasswordUseCase: IResetPasswordUseCase
  ) {}

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new AppError('Request body is empty', 'EMPTY_REQUEST_BODY', 400);
      }

      // Check required fields
      const requiredFields = ['token', 'newPassword', 'confirmPassword'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 'MISSING_REQUIRED_FIELDS', 400);
      }

      // Create reset password request
      const resetPasswordRequest: ResetPasswordRequest = {
        token: req.body.token,
        newPassword: req.body.newPassword,
        confirmPassword: req.body.confirmPassword
      };

      // Execute use case
      const result = await this.resetPasswordUseCase.execute(resetPasswordRequest);

      // Send response
      res.status(200).json({
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: error.errorCode,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString()
        });
      }
    }
  }
}