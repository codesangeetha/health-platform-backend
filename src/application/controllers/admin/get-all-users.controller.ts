import { Request, Response } from 'express';
import { IGetAllUsersUseCase } from '@/domain/use-cases/interfaces/admin/get-all-users.use-case.interface';
import { GetAllUsersRequest } from '@/domain/types/admin/get-all-users.type';
import { AppError } from '@/shared/errors/app-error';
import { IGetAllUsersController } from '../interfaces/admin/get-users.controller.interface';

export class GetAllUsersController implements IGetAllUsersController {
    constructor(
        private readonly getAllUsersUseCase: IGetAllUsersUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {

            const tokenUserType = (request as any).user?.userType;
            const userType = request.query.userType as 'patient' | 'doctor' | 'admin';

            if (tokenUserType !== "admin") {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }
            //Get page and limit from query params
            const page = request.query.page ? parseInt(request.query.page as string, 10) : 1;
            const limit = request.query.limit ? parseInt(request.query.limit as string, 10) : 10;

            const useCaseRequest: GetAllUsersRequest = {
                userType,
                page,
                limit
            };

            const result = await this.getAllUsersUseCase.execute(useCaseRequest);

            response.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                response.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.errorCode,
                    timestamp: new Date().toISOString()
                });
            } else {
                response.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: 'INTERNAL_SERVER_ERROR',
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
}