import { Request, Response } from 'express';

export interface IUpdateUserStatusController {
  handle(request: Request, response: Response): Promise<void>;
}
