import { Request, Response } from 'express';

export interface IGetPatientProfileController {
  handle(request: Request, response: Response): Promise<void>;
}
