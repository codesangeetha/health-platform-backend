import { Request, Response } from 'express';
import { IGetDoctorDashboardCountsUseCase } from '@/domain/use-cases/interfaces/doctor/get-doctor-dashboard-counts.use-case.interface';
import { GetDoctorDashboardCountsRequest } from '@/domain/types/doctor/doctor-dashboard-counts.type';
import { AppError } from '@/shared/errors/app-error';
import { IGetDoctorDashboardCountsController } from '../interfaces/doctor/get-doctor-dashboard-counts.controller.interface';

export class GetDoctorDashboardCountsController implements IGetDoctorDashboardCountsController {
  constructor(
    private readonly getDoctorDashboardCountsUseCase: IGetDoctorDashboardCountsUseCase
  ) {}

  async handle(request: Request, response: Response): Promise<void> {
    try {
      // Extract user information from authenticated request
      const { userId, userType } = this.getUserInfoFromRequest(request);

      // Validate that only doctors can access this endpoint
      if (userType !== 'doctor') {
        response.status(403).json({
          success: false,
          message: 'Access denied. This endpoint is only available to doctors.',
          error: 'FORBIDDEN',
          timestamp: new Date().toISOString(),
          data: {
            todayAppointments: 0,
            totalAppointments: 0,
            pendingConsultations: 0,
            todayCompletedConsultations: 0
          }
        });
        return;
      }

      const useCaseRequest: GetDoctorDashboardCountsRequest = {
        doctorId: userId
      };

      const result = await this.getDoctorDashboardCountsUseCase.execute(useCaseRequest);

      response.status(result.success ? 200 : 500).json(result);
    } catch (error) {
      console.error('Doctor Dashboard Error:', error);
      if (error instanceof AppError) {
        response.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: error.errorCode,
          timestamp: new Date().toISOString(),
          data: {
            todayAppointments: 0,
            totalAppointments: 0,
            pendingConsultations: 0,
            todayCompletedConsultations: 0
          }
        });
      } else {
        response.status(500).json({
          success: false,
          message: 'Internal server error while retrieving dashboard counts',
          error: 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString(),
          data: {
            todayAppointments: 0,
            totalAppointments: 0,
            pendingConsultations: 0,
            todayCompletedConsultations: 0
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