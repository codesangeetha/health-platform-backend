import { Request, Response } from 'express';

export interface IDeletePatientByAdminController {
  handle(request: Request, response: Response): Promise<void>;
}