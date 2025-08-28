import { Request, Response } from 'express';

export interface IUpdatePatientProfileController {
  handle(request: Request, response: Response): Promise<void>;
}
