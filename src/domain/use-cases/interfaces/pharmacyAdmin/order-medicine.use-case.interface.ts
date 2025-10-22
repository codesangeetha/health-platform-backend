import { OrderMedicineRequest, OrderMedicineResponse } from '@/domain/types/pharmacyAdmin/order-medicine.type';

export interface IOrderMedicineUseCase {
    execute(request: OrderMedicineRequest): Promise<OrderMedicineResponse>
}