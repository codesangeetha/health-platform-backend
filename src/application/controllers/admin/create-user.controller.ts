import { Request, Response } from 'express';
import { ICreateUserController } from '../interfaces/admin/create-user.controller.interface';
import { ICreateUserUseCase } from '@/domain/use-cases/interfaces/admin/create-user.use-case.interface';
import { AppError } from '@/shared/errors/app-error';

export class CreateUserController implements ICreateUserController {
  constructor(
    private readonly createUserUseCase: ICreateUserUseCase
  ) { }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const tokenUserType = (req as any).user?.userType;

      if (tokenUserType !== "admin") {
        throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
      }

      const { userType } = req.body;


      if (!['patient', 'doctor'].includes(userType)) {
        throw new AppError('Invalid user type', 'INVALID_USER_TYPE', 400);
      }

      let createUserRequest = req.body;


      const result = await this.createUserUseCase.execute(createUserRequest);

      res.status(201).json(result);

    } catch (error) {

      if (error instanceof AppError) {
        console.log('AppError caught:', {
          message: error.message,
          errorCode: error.errorCode,
          statusCode: error.statusCode
        });

        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: error.errorCode
        });
      } else {
        console.log('Non-AppError caught, sending generic 500 response');

        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: 'INTERNAL_SERVER_ERROR'
        });
      }

      console.log('=== REGISTER USER ERROR END ===');
    }
  }
}