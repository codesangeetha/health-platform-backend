import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IUpdateUserStatusController } from '../interfaces/admin/update-user-status.controller.interface';
import { UpdateUserStatusRequest } from '@/domain/types/admin/update-user-status.type';
import { IUpdateUserStatusUseCase } from '@/domain/use-cases/interfaces/admin/update-user-status.use-case.interface';
export class UpdateUserStatusController implements IUpdateUserStatusController {
    constructor(
        private readonly updateUserStatusUseCase: IUpdateUserStatusUseCase
    ) { }

    async handle(request: Request, response: Response): Promise<void> {
        try {

            const tokenUserType = (request as any).user?.userType;
            if (tokenUserType !== "admin") {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            const userId = (request as any).params.userId;
            if (!userId) {
                throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
            }

            const useCaseRequest: UpdateUserStatusRequest = {
                isVerified: request.body.isVerified
            };

            const result = await this.updateUserStatusUseCase.execute(userId, useCaseRequest);

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