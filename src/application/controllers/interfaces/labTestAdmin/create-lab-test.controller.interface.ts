import { Request, Response } from 'express';

export interface ICreateLabTestController {
    handle(req: Request, res: Response): Promise<void>;
}