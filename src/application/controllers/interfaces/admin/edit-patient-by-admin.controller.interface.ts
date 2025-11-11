import { Request, Response } from 'express';

export interface IEditPatientByAdminController {
  handle(request: Request, response: Response): Promise<void>;
}