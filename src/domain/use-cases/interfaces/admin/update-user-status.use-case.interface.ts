import { UpdateUserStatusRequest, UpdateUserStatusResponse } from '@/domain/types/admin/update-user-status.type';

export interface IUpdateUserStatusUseCase {
  execute(userId:string,request: UpdateUserStatusRequest): Promise<UpdateUserStatusResponse>;
}