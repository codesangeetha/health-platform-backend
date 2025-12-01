import { Request, Response } from 'express';
import { IGetLabTestDashboardCountsUseCase } from '@/domain/use-cases/interfaces/labTestAdmin/get-lab-test-dashboard-counts.use-case.interface';
import { GetLabTestDashboardCountsRequest } from '@/domain/types/labTestAdmin/get-lab-test-dashboard-counts.type';
import { AppError } from '@/shared/errors/app-error';
import { IGetLabTestDashboardCountsController } from '../interfaces/labTestAdmin/get-lab-test-dashboard-counts.controller.interface';

export class GetLabTestDashboardCountsController implements IGetLabTestDashboardCountsController {
  constructor(
    private readonly getLabTestDashboardCountsUseCase: IGetLabTestDashboardCountsUseCase
  ) {}

  async handle(request: Request, response: Response): Promise<void> {
    try {
      const useCaseRequest: GetLabTestDashboardCountsRequest = {};

      const result = await this.getLabTestDashboardCountsUseCase.execute(useCaseRequest);

      response.status(result.success ? 200 : 500).json(result);
    } catch (error) {
      console.error('Lab Test Dashboard Error:', error);
      if (error instanceof AppError) {
        response.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: error.errorCode,
          timestamp: new Date().toISOString(),
          data: {
            totalLabTests: 0,
            totalLabTestOrders: 0
          }
        });
      } else {
        response.status(500).json({
          success: false,
          message: 'Internal server error while retrieving lab test dashboard counts',
          error: 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString(),
          data: {
            totalLabTests: 0,
            totalLabTestOrders: 0
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
