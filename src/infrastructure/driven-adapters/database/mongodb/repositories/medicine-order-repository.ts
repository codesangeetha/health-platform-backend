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
      if (userId) filter.patientId = userId;

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

  async updateStatusWithIndividualMedicines(id: string, status: string, reason?: string, medicineUpdates?: { medicineId: string; itemStatus: 'completed' | 'skipped'; }[]): Promise<MedicineOrder | null> {
    try {
      const updateData: any = { status, updatedAt: new Date() };
      
      // Add reason if provided
      if (reason !== undefined) {
        updateData.reason = reason;
      }
      
      // If medicine updates are provided, process individual medicine statuses
      if (medicineUpdates && medicineUpdates.length > 0) {
        // Get the current order to update individual medicine statuses
        const currentOrder = await this.medicineOrderModel.findById(id).lean();
        if (!currentOrder) {
          return null;
        }

        // Create a map for quick lookup of medicine updates
        const medicineUpdatesMap = new Map();
        medicineUpdates.forEach(update => {
          medicineUpdatesMap.set(update.medicineId, update);
        });

        // Update items with individual medicine statuses and calculate new total
        let newTotalAmount = 0;
        const updatedItems = currentOrder.items.map((item: any) => {
          // Convert medicineId to string for comparison
          const medicineId = item.medicineId ? item.medicineId.toString() : '';
          
          // Find matching medicine update
          let matchingUpdate = null;
          if (medicineUpdatesMap.has(medicineId)) {
            matchingUpdate = medicineUpdatesMap.get(medicineId);
          } else {
            // Try to find by string comparison (in case medicineId is already a string)
            for (const [updateId, update] of medicineUpdatesMap.entries()) {
              if (updateId === medicineId || update.medicineId === medicineId) {
                matchingUpdate = update;
                break;
              }
            }
          }
          
          if (matchingUpdate) {
            const updatedItem = {
              ...item,
              itemStatus: matchingUpdate.itemStatus
            };
            
            // Calculate total for non-skipped medicines
            if (matchingUpdate.itemStatus !== 'skipped') {
              newTotalAmount += (item.price || 0) * (item.quantity || 1);
            }
            
            return updatedItem;
          } else {
            // Ensure itemStatus field exists for backward compatibility
            const existingItem = {
              ...item,
              itemStatus: item.itemStatus || 'pending'
            };
            
            // Calculate total for existing non-skipped medicines
            const existingStatus = item.itemStatus || 'pending';
            if (existingStatus !== 'skipped') {
              newTotalAmount += (item.price || 0) * (item.quantity || 1);
            }
            
            return existingItem;
          }
        });

        updateData.items = updatedItems;
        updateData.totalAmount = newTotalAmount;
      }

      const doc = await this.medicineOrderModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      )
        .populate('prescriptionId')
        .populate('items.medicineId')
        .lean();

      if (!doc) return null;

      return MedicineOrder.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (updateStatusWithIndividualMedicines medicine order):', error);
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