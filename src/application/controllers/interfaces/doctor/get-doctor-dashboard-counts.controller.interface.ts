import { GetDoctorDashboardCountsRequest, GetDoctorDashboardCountsResponse } from '@/domain/types/doctor/doctor-dashboard-counts.type';
import { Request, Response } from 'express';

export interface IGetDoctorDashboardCountsController {
  handle(req: Request, res: Response): Promise<void>;
  getUserInfoFromRequest(req: Request): { userId: string; userType: string };
}