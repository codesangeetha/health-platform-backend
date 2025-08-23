import { ResetPasswordRequest, ResetPasswordResponse } from '@/domain/types/authentication/reset-password.type';

export interface IResetPasswordUseCase {
  execute(request: ResetPasswordRequest): Promise<ResetPasswordResponse>;
}