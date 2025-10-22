import { LabTestOrder } from '@/domain/entities/lab-test-order.entity';

export interface ILabTestOrderRepository {
  create(order: any): Promise<LabTestOrder>;
  findAll(
    page: number,
    limit: number,
    status?: string,
    userId?: string
  ): Promise<{ orders: LabTestOrder[]; total: number }>;
  findById(id: string): Promise<LabTestOrder | null>;
  findByOrderId(orderId: string): Promise<LabTestOrder | null>;
  findByPrescriptionId(prescriptionId: string): Promise<LabTestOrder[]>;
  findByUserId(userId: string): Promise<LabTestOrder[]>;
  findPatientOrders(
    userId: string,
    status?: string,
    page?: number,
    limit?: number,
    orderType?: string
  ): Promise<{ orders: LabTestOrder[]; total: number }>;
  updateStatus(id: string, status: string): Promise<LabTestOrder | null>;
  updateTrackingNumber(id: string, trackingNumber: string): Promise<LabTestOrder | null>;
  deleteById(id: string): Promise<boolean>;
}