import { Request, Response } from 'express';

export interface IDoctorProfileController {
  handle(request: Request, response: Response): Promise<void>;
}
