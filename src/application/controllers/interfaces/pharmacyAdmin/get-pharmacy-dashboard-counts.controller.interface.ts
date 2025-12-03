import { GetPharmacyDashboardCountsRequest, GetPharmacyDashboardCountsResponse } from '@/domain/types/pharmacyAdmin/get-pharmacy-dashboard-counts.type';
import { Request, Response } from 'express';

export interface IGetPharmacyDashboardCountsController {
  handle(req: Request, res: Response): Promise<void>;
  getUserInfoFromRequest(req: Request): { userId: string; userType: string };
}