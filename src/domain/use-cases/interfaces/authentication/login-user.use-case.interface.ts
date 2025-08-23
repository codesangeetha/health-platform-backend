import { UserLoginRequest, UserLoginResponse } from '@/domain/types/authentication/user-login.type';

export interface ILoginUserUseCase {
  execute(request: UserLoginRequest): Promise<UserLoginResponse>;
}