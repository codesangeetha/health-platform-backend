import { Request, Response } from 'express';

export interface IDeleteLabTestController {
    handle(req: Request, res: Response): Promise<void>;
}