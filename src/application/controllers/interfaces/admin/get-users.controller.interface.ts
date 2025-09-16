import { Request, Response } from 'express';

export interface IGetAllUsersController {
  handle(request: Request, response: Response): Promise<void>;
}