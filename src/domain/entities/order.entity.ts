import { Types } from 'mongoose';

export interface OrderItem {
    medicineId?: string;
    labTestId?: string;
    medicineDetails?: any; // Store populated medicine data
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

export class Order {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly orderType: 'medicine' | 'lab_test' = 'medicine',
    public readonly items: OrderItem[],
    public readonly deliveryAddress: DeliveryAddress,
    public readonly deliveryMethod: string,
    public readonly totalAmount: number = 0,
    public readonly status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'sample_collected' | 'in_progress' | 'completed' = 'pending',
    public readonly prescriptionId?: string,
    public readonly labTestId?: string,
    public readonly estimatedDelivery?: Date,
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
      labTestId: this.labTestId ? new Types.ObjectId(this.labTestId) : undefined,
      items: this.items.map(item => ({
        medicineId: item.medicineId ? new Types.ObjectId(item.medicineId) : undefined,
        labTestId: item.labTestId ? new Types.ObjectId(item.labTestId) : undefined,
        quantity: item.quantity,
        price: item.price
      })),
      deliveryAddress: this.deliveryAddress,
      deliveryMethod: this.deliveryMethod,
      totalAmount: this.totalAmount,
      status: this.status,
      estimatedDelivery: this.estimatedDelivery,
      trackingNumber: this.trackingNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId ? new Types.ObjectId(this.userId) : undefined,
      patientId: this.patientId ? new Types.ObjectId(this.patientId) : undefined
    };
  }

  // Static method to create entity from MongoDB document
  static fromMongoDocument(doc: any): Order {
    return new Order(
      doc._id.toString(),
      doc.orderId,
      doc.orderType || 'medicine',
      doc.items.map((item: any) => ({
        medicineId: item.medicineId?._id ? item.medicineId._id.toString() : item.medicineId?.toString(),
        labTestId: item.labTestId?._id ? item.labTestId._id.toString() : item.labTestId?.toString(),
        medicineDetails: item.medicineId?._id ? item.medicineId : null, // Store populated medicine data
        labTestDetails: item.labTestId?._id ? item.labTestId : null, // Store populated lab test data
        quantity: item.quantity,
        price: item.price
      })),
      doc.deliveryAddress,
      doc.deliveryMethod,
      doc.totalAmount,
      doc.status,
      doc.prescriptionId ? doc.prescriptionId.toString() : undefined,
      doc.labTestId ? doc.labTestId.toString() : undefined,
      doc.estimatedDelivery,
      doc.trackingNumber,
      doc.createdAt,
      doc.updatedAt,
      doc.userId ? doc.userId.toString() : undefined,
      doc.patientId ? doc.patientId.toString() : undefined
    );
  }
}