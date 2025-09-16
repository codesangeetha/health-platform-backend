import { Request, Response } from 'express';
import { UserRegistrationRequest, UserRegistrationResponse } from '@/domain/types/authentication/user-registration.type';

export interface ICreateUserController {
  createUser(req: Request, res: Response): Promise<void>;
}

