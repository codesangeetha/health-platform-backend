import { Request, Response } from 'express';

export interface IGetMedicineDetailsController {
   handle(req: Request, res: Response): Promise<void>;
}