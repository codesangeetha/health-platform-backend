// src/infrastructure/driven-adapters/database/mongodb/repositories/medicine-order-repository.ts
import { AppError } from '@/shared/errors/app-error';
import { MedicineOrder } from '@/domain/entities/medicine-order.entity';
import { IMedicineOrderRepository } from './medicine-order-repository.interface';

export class MedicineOrderRepositoryMongoDB implements IMedicineOrderRepository {
  constructor(private readonly medicineOrderModel: any) {}

  async create(order: any): Promise<MedicineOrder> {
    try {
      // Save into MongoDB
      const doc = await this.medicineOrderModel.create(order);

      // Convert back to entity
      return MedicineOrder.fromMongoDocument(doc.toObject());
    } catch (error) {
      console.error("Database error (create medicine order):", error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findAll(
    page: number,
    limit: number,
    status?: string,
    userId?: string
  ): Promise<{ orders: MedicineOrder[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build filter conditions dynamically
      const filter: any = {};
      if (status) filter.status = status;
      if (userId) filter.userId = userId;

      // Fetch data & count total
      const [docs, total] = await Promise.all([
        this.medicineOrderModel.find(filter)
          .populate('prescriptionId')
          .populate('items.medicineId')
          .sort({ createdAt: -1 }) // Most recent first
          .skip(skip)
          .limit(limit)
          .lean(),
        this.medicineOrderModel.countDocuments(filter),
      ]);

      // Convert documents to entities
      const orders = docs.map((doc: any) => MedicineOrder.fromMongoDocument(doc));

      return { orders, total };
    } catch (error) {
      console.error('Database error (findAll medicine orders):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findById(id: string): Promise<MedicineOrder | null> {
    try {
      const doc = await this.medicineOrderModel.findById(id)
        .populate('prescriptionId')
        .populate('items.medicineId')
        .lean();

      if (!doc) return null;

      return MedicineOrder.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (findById medicine order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByOrderId(orderId: string): Promise<MedicineOrder | null> {
    try {
      const doc = await this.medicineOrderModel.findOne({ orderId })
        .populate('prescriptionId')
        .populate('items.medicineId')
        .lean();

      if (!doc) return null;

      return MedicineOrder.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (findByOrderId medicine order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByPrescriptionId(prescriptionId: string): Promise<MedicineOrder[]> {
    try {
      const docs = await this.medicineOrderModel.find({ prescriptionId })
        .populate('prescriptionId')
        .populate('items.medicineId')
        .sort({ createdAt: -1 })
        .lean();

      return docs.map((doc: any) => MedicineOrder.fromMongoDocument(doc));
    } catch (error) {
      console.error('Database error (findByPrescriptionId medicine order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findByUserId(userId: string): Promise<MedicineOrder[]> {
    try {
      const docs = await this.medicineOrderModel.find({ userId })
        .populate('prescriptionId')
        .populate('items.medicineId')
        .sort({ createdAt: -1 })
        .lean();

      return docs.map((doc: any) => MedicineOrder.fromMongoDocument(doc));
    } catch (error) {
      console.error('Database error (findByUserId medicine order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async updateStatus(id: string, status: string): Promise<MedicineOrder | null> {
    try {
      const doc = await this.medicineOrderModel.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      )
        .populate('prescriptionId')
        .populate('items.medicineId')
        .lean();

      if (!doc) return null;

      return MedicineOrder.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (updateStatus medicine order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async findPatientOrders(
    userId: string,
    status?: string,
    page: number = 1,
    limit: number = 10,
    orderType?: string
  ): Promise<{ orders: MedicineOrder[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      // Build filter conditions
      const filter: any = { patientId: userId };
      if (status) filter.status = status;
      if (orderType) filter.orderType = orderType;

      // Fetch data & count total
      const [docs, total] = await Promise.all([
        this.medicineOrderModel.find(filter)
          .populate('prescriptionId')
          .populate('items.medicineId')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        this.medicineOrderModel.countDocuments(filter),
      ]);

      // Convert documents to entities
      const orders = docs.map((doc: any) => MedicineOrder.fromMongoDocument(doc));

      return { orders, total };
    } catch (error) {
      console.error('Database error (findPatientOrders medicine):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async updateTrackingNumber(id: string, trackingNumber: string): Promise<MedicineOrder | null> {
    try {
      const doc = await this.medicineOrderModel.findByIdAndUpdate(
        id,
        { trackingNumber, updatedAt: new Date() },
        { new: true }
      )
        .populate('prescriptionId')
        .populate('items.medicineId')
        .lean();

      if (!doc) return null;

      return MedicineOrder.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (updateTrackingNumber medicine order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.medicineOrderModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Database error (deleteById medicine order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }
}