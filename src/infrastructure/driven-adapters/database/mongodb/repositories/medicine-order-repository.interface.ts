import { MedicineOrder } from '@/domain/entities/medicine-order.entity';

export interface IMedicineOrderRepository {
  create(order: any): Promise<MedicineOrder>;
  findAll(
    page: number,
    limit: number,
    status?: string,
    userId?: string
  ): Promise<{ orders: MedicineOrder[]; total: number }>;
  findById(id: string): Promise<MedicineOrder | null>;
  findByOrderId(orderId: string): Promise<MedicineOrder | null>;
  findByPrescriptionId(prescriptionId: string): Promise<MedicineOrder[]>;
  findByUserId(userId: string): Promise<MedicineOrder[]>;
  findPatientOrders(
    userId: string,
    status?: string,
    page?: number,
    limit?: number,
    orderType?: string
  ): Promise<{ orders: MedicineOrder[]; total: number }>;
  updateStatus(id: string, status: string): Promise<MedicineOrder | null>;
  updateTrackingNumber(id: string, trackingNumber: string): Promise<MedicineOrder | null>;
  deleteById(id: string): Promise<boolean>;
}