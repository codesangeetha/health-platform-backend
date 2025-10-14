import { Types } from 'mongoose';

export interface MedicineOrderItem {
    medicineId?: string;
    medicineDetails?: any; // Store populated medicine data
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

export class MedicineOrder {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly orderType: 'medicine' = 'medicine',
    public readonly items: MedicineOrderItem[],
    public readonly deliveryAddress: DeliveryAddress,
    public readonly deliveryMethod: string,
    public readonly totalAmount: number = 0,
    public readonly status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' = 'pending',
    public readonly prescriptionId?: string,
    public readonly estimatedDelivery?: Date,
    public readonly trackingNumber?: string,
    public readonly paymentUrl?: string,
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
        medicineId: new Types.ObjectId(item.medicineId!),
        quantity: item.quantity,
        price: item.price || 0
      })),
      deliveryAddress: this.deliveryAddress,
      deliveryMethod: this.deliveryMethod,
      totalAmount: this.totalAmount,
      status: this.status,
      estimatedDelivery: this.estimatedDelivery,
      trackingNumber: this.trackingNumber,
      paymentUrl: this.paymentUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId ? new Types.ObjectId(this.userId) : undefined,
      patientId: this.patientId ? new Types.ObjectId(this.patientId) : undefined
    };
  }

  // Static method to create entity from MongoDB document
  static fromMongoDocument(doc: any): MedicineOrder {
    return new MedicineOrder(
      doc._id.toString(),
      doc.orderId,
      doc.orderType || 'medicine',
      doc.items.map((item: any) => ({
        medicineId: item.medicineId?._id ? item.medicineId._id.toString() : item.medicineId?.toString(),
        medicineDetails: item.medicineId?._id ? item.medicineId : null, // Store populated medicine data
        quantity: item.quantity,
        price: item.price || 0
      })),
      doc.deliveryAddress,
      doc.deliveryMethod,
      doc.totalAmount,
      doc.status,
      doc.prescriptionId ? doc.prescriptionId.toString() : undefined,
      doc.estimatedDelivery,
      doc.trackingNumber,
      doc.paymentUrl,
      doc.createdAt,
      doc.updatedAt,
      doc.userId ? doc.userId.toString() : undefined,
      doc.patientId ? doc.patientId.toString() : undefined
    );
  }
}