import { Request, Response } from 'express';

export interface ISearchMedicinesController {
   handle(req: Request, res: Response): Promise<void>;
}