import { Request, Response } from 'express';
import { GetPatientProfileRequest } from '@/domain/types/patient/get-patient-profile.type';
import { AppError } from '@/shared/errors/app-error';
import { IGetDoctorProfileUseCase } from '@/domain/use-cases/interfaces/doctor/get-doctor-profile.use-case.interface';

export class GetDoctorProfileController implements GetDoctorProfileController{
  constructor(
    private readonly getDoctorProfileUseCase: IGetDoctorProfileUseCase
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

      const result = await this.getDoctorProfileUseCase.execute(useCaseRequest);

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