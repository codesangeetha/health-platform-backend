import { Order } from '@/domain/entities/order.entity';
import { LabTestOrder } from '@/domain/entities/labTestOrder.entity';

export interface IOrderRepository {
  create(order: any): Promise<Order>;
  createLabTestOrder(order: any): Promise<LabTestOrder>;
  findAll(
    page: number,
    limit: number,
    status?: string,
    userId?: string
  ): Promise<{ orders: Order[]; total: number }>;
  findLabTestOrders(
    userId: string,
    status?: string,
    page?: number,
    limit?: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ orders: LabTestOrder[]; total: number }>;
  findById(id: string): Promise<Order | null>;
  findByOrderId(orderId: string): Promise<Order | null>;
  findByPrescriptionId(prescriptionId: string): Promise<Order[]>;
  findByUserId(userId: string): Promise<Order[]>;
  findPatientOrders(
    userId: string,
    status?: string,
    page?: number,
    limit?: number,
    orderType?: string
  ): Promise<{ orders: Order[]; total: number }>;
  updateStatus(id: string, status: string): Promise<Order | null>;
  updateTrackingNumber(id: string, trackingNumber: string): Promise<Order | null>;
  deleteById(id: string): Promise<boolean>;
}