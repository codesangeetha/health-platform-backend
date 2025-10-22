import { Request, Response } from 'express';
import { ILoginUserController } from '../interfaces/authentication/login-user.controller.interface';
import { ILoginUserUseCase } from '@/domain/use-cases/interfaces/authentication/login-user.use-case.interface';
import { UserLoginRequest } from '@/domain/types/authentication/user-login.type';
import { AppError } from '@/shared/errors/app-error';

export class LoginUserController implements ILoginUserController {
  constructor(
    private readonly loginUserUseCase: ILoginUserUseCase
  ) {}

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new AppError('Request body is empty', 'EMPTY_REQUEST_BODY', 400);
      }

      // Check required fields
      const requiredFields = ['email', 'password'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 'MISSING_REQUIRED_FIELDS', 400);
      }

      // Create user login request
      const userLoginRequest: UserLoginRequest = {
        email: req.body.email,
        password: req.body.password
      };

      // Execute use case
      const result = await this.loginUserUseCase.execute(userLoginRequest);

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