import { Request, Response } from 'express';

export interface IUpdateMedicineController {
    handle(req: Request, res: Response): Promise<void>;
}