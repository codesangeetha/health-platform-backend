import { Request, Response } from 'express';

export interface IUpdateDoctorProfileController {
  handle(request: Request, response: Response): Promise<void>;
}
