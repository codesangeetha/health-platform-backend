import { UserRegistrationRequest, UserRegistrationResponse } from '@/domain/types/authentication/user-registration.type';

export interface IRegisterUserUseCase {
  execute(request: UserRegistrationRequest): Promise<UserRegistrationResponse>;
}