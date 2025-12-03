import { GetLabTestDashboardCountsRequest, GetLabTestDashboardCountsResponse } from '@/domain/types/labTestAdmin/get-lab-test-dashboard-counts.type';
import { Request, Response } from 'express';

export interface IGetLabTestDashboardCountsController {
  handle(req: Request, res: Response): Promise<void>;
  getUserInfoFromRequest(req: Request): { userId: string; userType: string };
}
