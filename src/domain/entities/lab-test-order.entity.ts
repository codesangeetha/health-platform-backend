import { Types } from 'mongoose';

export interface LabTestOrderItem {
    labTestId?: string;
    labTestDetails?: any; // Store populated lab test data
    quantity: number;
    price?: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export class LabTestOrder {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly orderType: 'lab_test' = 'lab_test',
    public readonly items: LabTestOrderItem[],
    public readonly deliveryAddress: DeliveryAddress,
    public readonly collectionMethod: string, // 'home_collection' or 'lab_visit'
    public readonly totalAmount: number = 0,
    public readonly status: 'pending' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled' = 'pending',
    public readonly prescriptionId?: string,
    public readonly scheduledDate?: Date,
    public readonly collectionAddress?: DeliveryAddress,
    public readonly trackingNumber?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly userId?: string, // This represents the patient who placed the order
    public readonly patientId?: string // Alias for userId for clarity
  ) { }

  // Convert to MongoDB document format
  public toMongoDocument() {
    return {
      orderId: this.orderId,
      orderType: this.orderType,
      prescriptionId: this.prescriptionId ? new Types.ObjectId(this.prescriptionId) : undefined,
      items: this.items.map(item => ({
        labTestId: new Types.ObjectId(item.labTestId!),
        quantity: item.quantity,
        price: item.price || 0
      })),
      deliveryAddress: this.deliveryAddress,
      collectionMethod: this.collectionMethod,
      totalAmount: this.totalAmount,
      status: this.status,
      scheduledDate: this.scheduledDate,
      collectionAddress: this.collectionAddress,
      trackingNumber: this.trackingNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId ? new Types.ObjectId(this.userId) : undefined,
      patientId: this.patientId ? new Types.ObjectId(this.patientId) : undefined
    };
  }

  // Static method to create entity from MongoDB document
  static fromMongoDocument(doc: any): LabTestOrder {
    return new LabTestOrder(
      doc._id.toString(),
      doc.orderId,
      doc.orderType || 'lab_test',
      doc.items.map((item: any) => ({
        labTestId: item.labTestId?._id ? item.labTestId._id.toString() : item.labTestId?.toString(),
        labTestDetails: item.labTestId?._id ? item.labTestId : null, // Store populated lab test data
        quantity: item.quantity,
        price: item.price || 0
      })),
      doc.deliveryAddress,
      doc.collectionMethod,
      doc.totalAmount,
      doc.status,
      doc.prescriptionId ? doc.prescriptionId.toString() : undefined,
      doc.scheduledDate,
      doc.collectionAddress,
      doc.trackingNumber,
      doc.createdAt,
      doc.updatedAt,
      doc.userId ? doc.userId.toString() : undefined,
      doc.patientId ? doc.patientId.toString() : undefined
    );
  }
}