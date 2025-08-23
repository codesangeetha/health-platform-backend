import { ForgotPasswordRequest, ForgotPasswordResponse } from '@/domain/types/authentication/forgot-password.type';

export interface IForgotPasswordUseCase {
  execute(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse>;
}