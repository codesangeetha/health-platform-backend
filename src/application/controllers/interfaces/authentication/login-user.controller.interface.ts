import { Request, Response } from 'express';

export interface ILoginUserController {
  loginUser(req: Request, res: Response): Promise<void>;
}