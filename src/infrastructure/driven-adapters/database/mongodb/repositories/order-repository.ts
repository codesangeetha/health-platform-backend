// src/infrastructure/driven-adapters/database/mongodb/repositories/order-repository.ts
import { AppError } from '@/shared/errors/app-error';
import { Order } from '@/domain/entities/order.entity';
import { IOrderRepository } from './order-repository.interface';

export class OrderRepositoryMongoDB implements IOrderRepository {
  constructor(private readonly orderModel: any) {}

  async create(order: any): Promise<Order> {
    try {
      // Save into MongoDB
      const doc = await this.orderModel.create(order);

      // Convert back to entity
      return Order.fromMongoDocument(doc.toObject());
    } catch (error) {
      console.error("Database error (create order):", error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findAll(
    page: number,
    limit: number,
    status?: string,
    userId?: string
  ): Promise<{ orders: Order[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build filter conditions dynamically
      const filter: any = {};
      if (status) filter.status = status;
      if (userId) filter.userId = userId;

      // Fetch data & count total
      const [docs, total] = await Promise.all([
        this.orderModel.find(filter)
          .populate('prescriptionId')
          .populate('items.medicineId')
          .sort({ createdAt: -1 }) // Most recent first
          .skip(skip)
          .limit(limit)
          .lean(),
        this.orderModel.countDocuments(filter),
      ]);

      // Convert documents to entities
      const orders = docs.map((doc: any) => Order.fromMongoDocument(doc));

      return { orders, total };
    } catch (error) {
      console.error('Database error (findAll orders):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const doc = await this.orderModel.findById(id)
        .populate('prescriptionId')
        .populate('items.medicineId')
        .lean();

      if (!doc) return null;

      return Order.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (findById order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByOrderId(orderId: string): Promise<Order | null> {
    try {
      const doc = await this.orderModel.findOne({ orderId })
        .populate('prescriptionId')
        .populate('items.medicineId')
        .lean();

      if (!doc) return null;

      return Order.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (findByOrderId order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByPrescriptionId(prescriptionId: string): Promise<Order[]> {
    try {
      const docs = await this.orderModel.find({ prescriptionId })
        .populate('prescriptionId')
        .populate('items.medicineId')
        .sort({ createdAt: -1 })
        .lean();

      return docs.map((doc: any) => Order.fromMongoDocument(doc));
    } catch (error) {
      console.error('Database error (findByPrescriptionId order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByUserId(userId: string): Promise<Order[]> {
    try {
      const docs = await this.orderModel.find({ userId })
        .populate('prescriptionId')
        .populate('items.medicineId')
        .sort({ createdAt: -1 })
        .lean();

      return docs.map((doc: any) => Order.fromMongoDocument(doc));
    } catch (error) {
      console.error('Database error (findByUserId order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async updateStatus(id: string, status: string): Promise<Order | null> {
    try {
      const doc = await this.orderModel.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      )
        .populate('prescriptionId')
        .populate('items.medicineId')
        .lean();

      if (!doc) return null;

      return Order.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (updateStatus order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findPatientOrders(
    userId: string,
    status?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ orders: Order[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build filter conditions
      const filter: any = { patientId:userId };
      if (status) filter.status = status;

      // Fetch data & count total
      const [docs, total] = await Promise.all([
        this.orderModel.find(filter)
          .populate('prescriptionId')
          .populate('items.medicineId')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.orderModel.countDocuments(filter),
      ]);

      // Convert documents to entities
      const orders = docs.map((doc: any) => Order.fromMongoDocument(doc));

      return { orders, total };
    } catch (error) {
      console.error('Database error (findPatientOrders):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async updateTrackingNumber(id: string, trackingNumber: string): Promise<Order | null> {
    try {
      const doc = await this.orderModel.findByIdAndUpdate(
        id,
        { trackingNumber, updatedAt: new Date() },
        { new: true }
      )
        .populate('prescriptionId')
        .populate('items.medicineId')
        .lean();

      if (!doc) return null;

      return Order.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (updateTrackingNumber order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.orderModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Database error (deleteById order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }
}