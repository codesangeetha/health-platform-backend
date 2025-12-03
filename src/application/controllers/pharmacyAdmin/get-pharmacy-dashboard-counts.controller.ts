import { Request, Response } from 'express';
import { IGetPharmacyDashboardCountsUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/get-pharmacy-dashboard-counts.use-case.interface';
import { GetPharmacyDashboardCountsRequest } from '@/domain/types/pharmacyAdmin/get-pharmacy-dashboard-counts.type';
import { AppError } from '@/shared/errors/app-error';
import { IGetPharmacyDashboardCountsController } from '../interfaces/pharmacyAdmin/get-pharmacy-dashboard-counts.controller.interface';

export class GetPharmacyDashboardCountsController implements IGetPharmacyDashboardCountsController {
  constructor(
    private readonly getPharmacyDashboardCountsUseCase: IGetPharmacyDashboardCountsUseCase
  ) {}

  async handle(request: Request, response: Response): Promise<void> {
    try {
      const useCaseRequest: GetPharmacyDashboardCountsRequest = {};

      const result = await this.getPharmacyDashboardCountsUseCase.execute(useCaseRequest);

      response.status(result.success ? 200 : 500).json(result);
    } catch (error) {
      console.error('Pharmacy Dashboard Error:', error);
      if (error instanceof AppError) {
        response.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: error.errorCode,
          timestamp: new Date().toISOString(),
          data: {
            totalMedicines: 0,
            totalOrders: 0
          }
        });
      } else {
        response.status(500).json({
          success: false,
          message: 'Internal server error while retrieving pharmacy dashboard counts',
          error: 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString(),
          data: {
            totalMedicines: 0,
            totalOrders: 0
          }
        });
      }
    }
  }

  getUserInfoFromRequest(request: Request): { userId: string; userType: string } {
    const user = (request as any).user;
    if (!(user?.userId || user?.id)) {
      throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
    }
    return {
      userId: user.userId || user.id,
      userType: user.userType || 'unknown'
    };
  }
}