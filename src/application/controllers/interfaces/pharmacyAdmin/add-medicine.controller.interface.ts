import { Request, Response } from 'express';

export interface IAddMedicineController {
   handle(req: Request, res: Response): Promise<void>;
}