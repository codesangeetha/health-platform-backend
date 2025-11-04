import { Request, Response } from 'express';
import { IGetDashboardCountsUseCase } from '@/domain/use-cases/interfaces/admin/get-dashboard-counts.use-case.interface';
import { AppError } from '@/shared/errors/app-error';
import { IGetDashboardCountsController } from '../interfaces/admin/get-dashboard-counts.controller.interface';

export class GetDashboardCountsController implements IGetDashboardCountsController {
  constructor(
    private readonly getDashboardCountsUseCase: IGetDashboardCountsUseCase
  ) {}

  async handle(request: Request, response: Response): Promise<void> {
    try {
      const tokenUserType = (request as any).user?.userType;

      if (tokenUserType !== "admin") {
        throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
      }

      const result = await this.getDashboardCountsUseCase.execute({});

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