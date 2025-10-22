import { Request, Response } from 'express';
import { IForgotPasswordController } from '../interfaces/authentication/forgot-password.controller.interface';
import { IForgotPasswordUseCase } from '@/domain/use-cases/interfaces/authentication/forgot-password.use-case.interface';
import { ForgotPasswordRequest } from '@/domain/types/authentication/forgot-password.type';
import { AppError } from '@/shared/errors/app-error';

export class ForgotPasswordController implements IForgotPasswordController {
  constructor(
    private readonly forgotPasswordUseCase: IForgotPasswordUseCase
  ) { }

  async forgotPassword(req: Request, res: Response): Promise<void> {

    try {
      // Validate request body
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new AppError('Request body is empty', 'EMPTY_REQUEST_BODY', 400);
      }

      // Check required fields
      const requiredFields = ['email'];
      const missingFields = requiredFields.filter(field => !req.body[field]);

      if (missingFields.length > 0) {
        throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 'MISSING_REQUIRED_FIELDS', 400);
      }

      // Create forgot password request
      const forgotPasswordRequest: ForgotPasswordRequest = {
        email: req.body.email
      };

      // Execute use case
      const result = await this.forgotPasswordUseCase.execute(forgotPasswordRequest);

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