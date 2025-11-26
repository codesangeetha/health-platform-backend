// src/domain/use-cases/interfaces/labTestAdmin/update-order-status.use-case.interface.ts
import { UpdateLabTestOrderStatusRequest, UpdateLabTestOrderStatusResponse } from '@/domain/types/labTestAdmin/update-order-status.type';

export interface IUpdateLabTestOrderStatusUseCase {
  execute(orderId: string, request: UpdateLabTestOrderStatusRequest): Promise<UpdateLabTestOrderStatusResponse>;
}