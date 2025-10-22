import { CreateUserRequest, CreateUserResponse } from '@/domain/types/admin/create-user.type';

export interface ICreateUserUseCase {
    execute(request: CreateUserRequest): Promise<CreateUserResponse>;
}