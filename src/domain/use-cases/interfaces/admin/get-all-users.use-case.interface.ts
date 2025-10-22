import { GetAllUsersRequest, GetAllUsersResponse } from '@/domain/types/admin/get-all-users.type';

export interface IGetAllUsersUseCase {
  execute(request: GetAllUsersRequest): Promise<GetAllUsersResponse>;
}