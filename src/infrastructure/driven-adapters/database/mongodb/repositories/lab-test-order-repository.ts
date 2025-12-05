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

  async updateStatusAndResults(id: string, status: string, result?: string): Promise<LabTestOrder | null> {
    try {
      const updateData: any = { status, updatedAt: new Date() };
      
      // If result is provided, update the items with test result
      if (result) {
        // Get the current order to update items with result
        const currentOrder = await this.labTestOrderModel.findById(id).lean();
        if (!currentOrder) {
          return null;
        }

        // Simple string format - apply to all items
        const updatedItems = currentOrder.items.map((item: any) => ({
          ...item,
          result: result, // Apply the same result to all items
          testStatus: item.testStatus || 'pending' // Ensure testStatus field exists
        }));
        updateData.items = updatedItems;
      }

      const doc = await this.labTestOrderModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      )
        .populate('prescriptionId')
        .populate('items.labTestId')
        .lean();

      if (!doc) return null;

      return LabTestOrder.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (updateStatusAndResults lab test order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async updateStatusReasonAndResults(id: string, status: string, reason?: string, result?: string | any[]): Promise<LabTestOrder | null> {
    try {
      const updateData: any = { status, updatedAt: new Date() };
      
      // Add reason if provided
      if (reason !== undefined) {
        updateData.reason = reason;
      }
      
      // If result is provided, update the items with test result
      if (result) {
        // Check if result is the processed items array (from new format)
        if (Array.isArray(result) && result.length > 0 && result[0].labTestId) {
          // This is the processed items array - use it directly
          updateData.items = result;
        } else {
          // Legacy string format - apply to all items
          // Get the current order to update items with result
          const currentOrder = await this.labTestOrderModel.findById(id).lean();
          if (!currentOrder) {
            return null;
          }

          const updatedItems = currentOrder.items.map((item: any) => ({
            ...item,
            result: result as string, // Apply the same result to all items
            testStatus: item.testStatus || 'pending' // Ensure testStatus field exists
          }));
          updateData.items = updatedItems;
        }
      }

      const doc = await this.labTestOrderModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      )
        .populate('prescriptionId')
        .populate('items.labTestId')
        .lean();

      if (!doc) return null;

      return LabTestOrder.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (updateStatusReasonAndResults lab test order):', error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

  async updateStatusWithIndividualTests(id: string, status: string, reason?: string, testUpdates?: { labTestId: string; testStatus: 'completed' | 'skipped'; testResult?: string | null; }[]): Promise<LabTestOrder | null> {
    try {
      const updateData: any = { status, updatedAt: new Date() };
      
      // Add reason if provided
      if (reason !== undefined) {
        updateData.reason = reason;
      }
      
      // If test updates are provided, process individual test statuses
      if (testUpdates && testUpdates.length > 0) {
        // Get the current order to update individual test statuses
        const currentOrder = await this.labTestOrderModel.findById(id).lean();
        if (!currentOrder) {
          return null;
        }

        // Create a map for quick lookup of test updates
        const testUpdatesMap = new Map();
        testUpdates.forEach(update => {
          testUpdatesMap.set(update.labTestId, update);
        });

        // Update items with individual test statuses and calculate new total
        let newTotalAmount = 0;
        const updatedItems = currentOrder.items.map((item: any) => {
          // Convert labTestId to string for comparison
          const labTestId = item.labTestId ? item.labTestId.toString() : '';
          
          // Find matching test update
          let matchingUpdate = null;
          if (testUpdatesMap.has(labTestId)) {
            matchingUpdate = testUpdatesMap.get(labTestId);
          } else {
            // Try to find by string comparison (in case labTestId is already a string)
            for (const [updateId, update] of testUpdatesMap.entries()) {
              if (updateId === labTestId || update.labTestId === labTestId) {
                matchingUpdate = update;
                break;
              }
            }
          }
          
          if (matchingUpdate) {
            const updatedItem = {
              ...item,
              testStatus: matchingUpdate.testStatus,
              result: matchingUpdate.testResult !== undefined ? matchingUpdate.testResult : item.result
            };
            
            // Calculate total for non-skipped tests
            if (matchingUpdate.testStatus !== 'skipped') {
              newTotalAmount += item.price || 0;
            }
            
            return updatedItem;
          } else {
            // Ensure testStatus field exists for backward compatibility
            const existingItem = {
              ...item,
              testStatus: item.testStatus || 'pending'
            };
            
            // Calculate total for existing non-skipped tests
            const existingStatus = item.testStatus || 'pending';
            if (existingStatus !== 'skipped') {
              newTotalAmount += item.price || 0;
            }
            
            return existingItem;
          }
        });

        updateData.items = updatedItems;
        updateData.totalAmount = newTotalAmount;
      }

      const doc = await this.labTestOrderModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      )
        .populate('prescriptionId')
        .populate('items.labTestId')
        .lean();

      if (!doc) return null;

      return LabTestOrder.fromMongoDocument(doc);
    } catch (error) {
      console.error('Database error (updateStatusWithIndividualTests lab test order):', error);
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