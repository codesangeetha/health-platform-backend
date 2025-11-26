// src/application/controllers/interfaces/labTestAdmin/update-order-status.controller.interface.ts
import { Request, Response } from 'express';

export interface IUpdateLabTestOrderStatusController {
  handle(req: Request, res: Response): Promise<void>;
}