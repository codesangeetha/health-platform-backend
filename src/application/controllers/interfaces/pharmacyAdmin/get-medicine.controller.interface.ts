import { Request, Response } from 'express';

export interface IGetMedicineController {
   handle(req: Request, res: Response): Promise<void>;
}