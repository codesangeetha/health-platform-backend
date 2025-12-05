import { Request, Response } from 'express';

export interface IGetPharmacyOrderByIdController {
    handle(req: Request, res: Response): Promise<void>;
}
