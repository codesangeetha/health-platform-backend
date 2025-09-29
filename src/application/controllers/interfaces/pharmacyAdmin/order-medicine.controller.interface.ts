import { Request, Response } from 'express';

export interface IOrderMedicineController {
    handle(req: Request, res: Response): Promise<void>;
}