import { GetPatientDashboardCountsRequest, GetPatientDashboardCountsResponse } from '@/domain/types/patient/patient-dashboard-counts.type';
import { Request, Response } from 'express';

export interface IGetPatientDashboardCountsController {
  handle(req: Request, res: Response): Promise<void>;
  getUserInfoFromRequest(req: Request): { userId: string; userType: string };
}