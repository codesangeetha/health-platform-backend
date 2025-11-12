import { Request, Response } from 'express';
import { IRegisterUserController } from '../interfaces/authentication/register-user.controller.interface';
import { IRegisterUserUseCase } from '@/domain/use-cases/interfaces/authentication/register-user.use-case.interface';
import { PatientRegistrationRequest, DoctorRegistrationRequest } from '@/domain/types/authentication/user-registration.type';
import { AppError } from '@/shared/errors/app-error';

export class RegisterUserController implements IRegisterUserController {
  constructor(
    private readonly registerUserUseCase: IRegisterUserUseCase
  ) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      console.log('=== REGISTER USER REQUEST START ===');
      
      const { userType } = req.body;
      
      if (!['patient', 'doctor'].includes(userType)) {
        throw new AppError('Invalid user type', 'INVALID_USER_TYPE', 400);
      }

      let registrationRequest;
      if (userType === 'patient') {
        const patientRequest: PatientRegistrationRequest = {
          ...req.body,
          userType: 'patient'
        };
        registrationRequest = patientRequest;
      } else {
        const doctorRequest: DoctorRegistrationRequest = {
          ...req.body,
          userType: 'doctor'
        };
        registrationRequest = doctorRequest;
      }

      const result = await this.registerUserUseCase.execute(registrationRequest);
      
      res.status(201).json(result);
      
    } catch (error) {
      
      console.log('error: ', error);
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