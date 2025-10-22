import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IAddMedicineUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/add-medicine.use-case.interface';
import { IAddMedicineController } from '../interfaces/pharmacyAdmin/add-medicine.controller.interface';

export class AddMedicineController implements IAddMedicineController {
    constructor(
        private readonly medicineUseCase: IAddMedicineUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {

            const tokenUserType = (req as any).user?.userType;

            if (tokenUserType !== "admin") {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            const result = await this.medicineUseCase.execute(req.body);

            res.status(201).json(result);

        } catch (error) {

            if (error instanceof AppError) {
                console.log('AppError caught:', {
                    message: error.message,
                    errorCode: error.errorCode,
                    statusCode: error.statusCode
                });

                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.errorCode
                });
            } else {
                console.log('Non-AppError caught, sending generic 500 response');

                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: 'INTERNAL_SERVER_ERROR'
                });
            }

            console.log('=== REGISTER USER ERROR END ===');
        }
    }
}