import { Request, Response } from 'express';

export interface IGetAvailableDoctorsController {
  handle(request: Request, response: Response): Promise<void>;
}