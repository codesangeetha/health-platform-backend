import { Request, Response } from 'express';
import { DoctorPasswordSetRequest } from '@/domain/types/authentication/doctor-password-set.type';

export interface IDoctorPasswordSetController {
  setDoctorPassword(req: Request, res: Response): Promise<void>;
}