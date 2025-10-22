import { Request, Response } from 'express';
import { IGetPatientProfileUseCase } from '@/domain/use-cases/interfaces/patient/get-patient-profile.use-case.interface';
import { GetPatientProfileRequest } from '@/domain/types/patient/get-patient-profile.type';
import { AppError } from '@/shared/errors/app-error';
import { IGetPatientProfileController } from '../interfaces/patient/get-patient-profile.controller.interface';

export class GetPatientProfileController implements IGetPatientProfileController{
  constructor(
    private readonly getPatientProfileUseCase: IGetPatientProfileUseCase
  ) {}

  async handle(request: Request, response: Response): Promise<void> {
    try {
      // Extract user ID from authenticated request (assuming JWT middleware adds this)
      
      const userId = (request as any).user?.userId;

      
      if (!userId) {
        throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
      }

      const useCaseRequest: GetPatientProfileRequest = {
        userId
      };

      const result = await this.getPatientProfileUseCase.execute(useCaseRequest);

      response.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        response.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: error.errorCode,
          timestamp: new Date().toISOString()
        });
      } else {
        response.status(500).json({
          success: false,
          message: 'Internal server error',
          error: 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString()
        });
      }
    }
  }
}