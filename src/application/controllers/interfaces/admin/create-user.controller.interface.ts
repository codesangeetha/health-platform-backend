import { Request, Response } from 'express';

export interface ICreateUserController {
  createUser(req: Request, res: Response): Promise<void>;
}

