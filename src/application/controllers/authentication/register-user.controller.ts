import { Request, Response } from 'express';
import { IRegisterUserController } from '../interfaces/authentication/register-user.controller.interface';
import { IRegisterUserUseCase } from '@/domain/use-cases/interfaces/authentication/register-user.use-case.interface';
import { UserRegistrationRequest } from '@/domain/types/authentication/user-registration.type';
import { AppError } from '@/shared/errors/app-error';

export class RegisterUserController implements IRegisterUserController {
  constructor(
    private readonly registerUserUseCase: IRegisterUserUseCase
  ) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      // Log incoming request
      console.log('=== REGISTER USER REQUEST START ===');
      console.log('Request URL:', req.url);
      console.log('Request Method:', req.method);
      console.log('Request Headers:', req.headers);
      console.log('Request Body:', req.body);
      
      // Validate request body
      if (!req.body || Object.keys(req.body).length === 0) {
        console.log('ERROR: Empty request body');
        throw new AppError('Request body is empty', 'EMPTY_REQUEST_BODY', 400);
      }

      // Check required fields
      const requiredFields = ['userType', 'email', 'password', 'firstName', 'lastName', 'phone', 'dateOfBirth'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        console.log('ERROR: Missing required fields:', missingFields);
        throw new AppError(`Missing required fields: ${missingFields.join(', ')}`, 'MISSING_REQUIRED_FIELDS', 400);
      }

      console.log('All required fields present');

      // Create user registration request
      const userRegistrationRequest: UserRegistrationRequest = {
        userType: req.body.userType,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        dateOfBirth: req.body.dateOfBirth,
        ...(req.body.userType === 'patient' && {
          bloodGroup: req.body.bloodGroup,
          allergies: req.body.allergies || [],
          chronicDiseases: req.body.chronicDiseases || [],
          emergencyContact: req.body.emergencyContact
        })
      };

      console.log('Processed registration request:', userRegistrationRequest);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userRegistrationRequest.email)) {
        console.log('ERROR: Invalid email format:', userRegistrationRequest.email);
        throw new AppError('Invalid email format', 'INVALID_EMAIL_FORMAT', 400);
      }

      // Validate password strength
      if (userRegistrationRequest.password.length < 8) {
        console.log('ERROR: Password too short:', userRegistrationRequest.password.length, 'characters');
        throw new AppError('Password must be at least 8 characters long', 'PASSWORD_TOO_SHORT', 400);
      }

      // Validate userType
      if (!['patient', 'doctor', 'admin'].includes(userRegistrationRequest.userType)) {
        console.log('ERROR: Invalid userType:', userRegistrationRequest.userType);
        throw new AppError('Invalid user type', 'INVALID_USER_TYPE', 400);
      }

      console.log('All validations passed');

      // Execute use case
      console.log('Executing register user use case...');
      
      const result = await this.registerUserUseCase.execute(userRegistrationRequest);
      
      console.log('Use case execution successful');
      console.log('Result:', result);

      // Send success response
      console.log('Sending success response with status 201');
      res.status(201).json(result);
      
      console.log('=== REGISTER USER REQUEST END ===');
    } catch (error) {
      console.log('=== REGISTER USER ERROR ===');
      console.log('Error occurred:', error);
      console.log('Error name:', error instanceof Error ? error.name : 'Unknown error');
      console.log('Error message:', error instanceof Error ? error.message : 'Unknown error message');
      console.log('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
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