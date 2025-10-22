// src/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.ts
import { AppError } from '@/shared/errors/app-error';
import { LabTestOrder } from '@/domain/entities/lab-test-order.entity';
import { ILabTestOrderRepository } from './lab-test-order-repository.interface';

export class LabTestOrderRepositoryMongoDB implements ILabTestOrderRepository {
  constructor(private readonly labTestOrderModel: any) {}

  async create(order: any): Promise<LabTestOrder> {
    try {
      // Save into MongoDB
      const doc = await this.labTestOrderModel.create(order);

      // Convert back to entity
      return LabTestOrder.fromMongoDocument(doc.toObject());
    } catch (error) {
      console.error("Database error (create lab test order):", error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findAll(
    page: number,
    limit: number,
    status?: string,
    userId?: string
  ): Promise<{ orders: LabTestOrder[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build filter conditions dynamically
      const filter: any = {};
      if (status) filter.status = status;
      if (userId) filter.userId = userId;

      // Fetch data & count total
      const [docs, total] = await Promise.all([
        this.labTestOrderModel.find(filter)
          .populate('prescriptionId')
          .populate('items.labTestId')
          .sort({ createdAt: -1 }) // Most recent first
          .skip(skip)
          .limit(limit)
          .lean(),
        this.labTestOrderModel.countDocuments(filter),
      ]);

      // Convert documents to entities
      const orders = docs.map((doc: any) => LabTestOrder.fromMongoDocument(doc));

      return { orders, total };
    } catch (error) {
      console.error('Database error (findAll lab test orders):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findById(id: string): Promise<LabTestOrder | null> {
    try {
      const doc = await this.labTestOrderModel.findById(id)
        .populate('prescriptionId')
        .populate('items.labTestId')
        .lean();

      if (!doc) return null;

      return LabTestOrder.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (findById lab test order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByOrderId(orderId: string): Promise<LabTestOrder | null> {
    try {
      const doc = await this.labTestOrderModel.findOne({ orderId })
        .populate('prescriptionId')
        .populate('items.labTestId')
        .lean();

      if (!doc) return null;

      return LabTestOrder.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (findByOrderId lab test order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByPrescriptionId(prescriptionId: string): Promise<LabTestOrder[]> {
    try {
      const docs = await this.labTestOrderModel.find({ prescriptionId })
        .populate('prescriptionId')
        .populate('items.labTestId')
        .sort({ createdAt: -1 })
        .lean();

      return docs.map((doc: any) => LabTestOrder.fromMongoDocument(doc));
    } catch (error) {
      console.error('Database error (findByPrescriptionId lab test order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByUserId(userId: string): Promise<LabTestOrder[]> {
    try {
      const docs = await this.labTestOrderModel.find({ userId })
        .populate('prescriptionId')
        .populate('items.labTestId')
        .sort({ createdAt: -1 })
        .lean();

      return docs.map((doc: any) => LabTestOrder.fromMongoDocument(doc));
    } catch (error) {
      console.error('Database error (findByUserId lab test order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async updateStatus(id: string, status: string): Promise<LabTestOrder | null> {
    try {
      const doc = await this.labTestOrderModel.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      )
        .populate('prescriptionId')
        .populate('items.labTestId')
        .lean();

      if (!doc) return null;

      return LabTestOrder.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (updateStatus lab test order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findPatientOrders(
    userId: string,
    status?: string,
    page: number = 1,
    limit: number = 10,
    orderType?: string
  ): Promise<{ orders: LabTestOrder[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build filter conditions
      const filter: any = { patientId: userId };
      if (status) filter.status = status;
      if (orderType) filter.orderType = orderType;

      // Fetch data & count total
      const [docs, total] = await Promise.all([
        this.labTestOrderModel.find(filter)
          .populate('prescriptionId')
          .populate('items.labTestId')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.labTestOrderModel.countDocuments(filter),
      ]);

      // Convert documents to entities
      const orders = docs.map((doc: any) => LabTestOrder.fromMongoDocument(doc));

      return { orders, total };
    } catch (error) {
      console.error('Database error (findPatientOrders lab test):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async updateTrackingNumber(id: string, trackingNumber: string): Promise<LabTestOrder | null> {
    try {
      const doc = await this.labTestOrderModel.findByIdAndUpdate(
        id,
        { trackingNumber, updatedAt: new Date() },
        { new: true }
      )
        .populate('prescriptionId')
        .populate('items.labTestId')
        .lean();

      if (!doc) return null;

      return LabTestOrder.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (updateTrackingNumber lab test order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.labTestOrderModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Database error (deleteById lab test order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }
}