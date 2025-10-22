import { Request, Response } from 'express';

export interface IDeleteMedicineController {
    handle(req: Request, res: Response): Promise<void>;
}