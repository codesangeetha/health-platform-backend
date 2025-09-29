import { Request, Response } from 'express';

export interface IUpdateMedicineInventoryController {
   handle(req: Request, res: Response): Promise<void>;
}