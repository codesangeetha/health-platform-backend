import { Request, Response } from 'express';
import { IGetPatientDashboardCountsUseCase } from '@/domain/use-cases/interfaces/patient/get-patient-dashboard-counts.use-case.interface';
import { GetPatientDashboardCountsRequest } from '@/domain/types/patient/patient-dashboard-counts.type';
import { AppError } from '@/shared/errors/app-error';
import { IGetPatientDashboardCountsController } from '../interfaces/patient/get-patient-dashboard-counts.controller.interface';

export class GetPatientDashboardCountsController implements IGetPatientDashboardCountsController {
  constructor(
    private readonly getPatientDashboardCountsUseCase: IGetPatientDashboardCountsUseCase
  ) {}

  async handle(request: Request, response: Response): Promise<void> {
    try {
      // Extract user information from authenticated request
      const { userId, userType } = this.getUserInfoFromRequest(request);

      // Validate that only patients can access this endpoint
      if (userType !== 'patient') {
        response.status(403).json({
          success: false,
          message: 'Access denied. This endpoint is only available to patients.',
          error: 'FORBIDDEN',
          timestamp: new Date().toISOString(),
          data: {
            upcomingAppointments: 0,
            allAppointments: 0,
            lastVisitDate: null
          }
        });
        return;
      }

      const useCaseRequest: GetPatientDashboardCountsRequest = {
        patientId: userId
      };

      const result = await this.getPatientDashboardCountsUseCase.execute(useCaseRequest);

      response.status(result.success ? 200 : 500).json(result);
    } catch (error) {
      console.error('Patient Dashboard Error:', error);
      if (error instanceof AppError) {
        response.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: error.errorCode,
          timestamp: new Date().toISOString(),
          data: {
            upcomingAppointments: 0,
            allAppointments: 0,
            lastVisitDate: null
          }
        });
      } else {
        response.status(500).json({
          success: false,
          message: 'Internal server error while retrieving dashboard counts',
          error: 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString(),
          data: {
            upcomingAppointments: 0,
            allAppointments: 0,
            lastVisitDate: null
          }
        });
      }
    }
  }

  getUserInfoFromRequest(request: Request): { userId: string; userType: string } {
    const user = (request as any).user;
    if (!user?.userId) {
      throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
    }
    return {
      userId: user.userId,
      userType: user.userType || 'unknown'
    };
  }
}