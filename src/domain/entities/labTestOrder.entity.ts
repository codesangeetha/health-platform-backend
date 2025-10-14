import { Types } from 'mongoose';

export interface LabTestOrderItem {
    labTestId?: string;
    labTestDetails?: any; // Store populated lab test data
    price?: number;
 }

export interface LabTestDeliveryAddress {
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
    public readonly testItems: LabTestOrderItem[],
    public readonly deliveryAddress: LabTestDeliveryAddress,
    public readonly collectionMethod: string, // 'home_collection' or 'lab_visit'
    public readonly totalAmount: number = 0,
    public readonly status: 'pending' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled' = 'pending',
    public readonly scheduledDate?: Date,
    public readonly collectionAddress?: LabTestDeliveryAddress,
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
      orderType: 'lab_test',
      labTestId: this.testItems.length > 0 && this.testItems[0]?.labTestId ? new Types.ObjectId(this.testItems[0].labTestId!) : undefined,
      items: this.testItems.map(item => ({
        labTestId: new Types.ObjectId(item.labTestId!),
        quantity: 1,
        price: item.price || 0
      })),
      deliveryAddress: this.deliveryAddress,
      deliveryMethod: this.collectionMethod,
      totalAmount: this.totalAmount,
      status: this.status,
      estimatedDelivery: this.scheduledDate,
      trackingNumber: this.trackingNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId ? new Types.ObjectId(this.userId) : undefined,
      patientId: this.patientId ? new Types.ObjectId(this.patientId) : undefined
    };
  }

  // Static method to create entity from MongoDB document
  static fromMongoDocument(doc: any): LabTestOrder {
    console.log('🔍 LAB_TEST_ORDER_ENTITY: Converting document:', doc._id);
    console.log('🔍 LAB_TEST_ORDER_ENTITY: Document items:', doc.items);
    console.log('🔍 LAB_TEST_ORDER_ENTITY: Document patientId:', doc.patientId);

    try {
      const result = new LabTestOrder(
        doc._id.toString(),
        doc.orderId,
        doc.items.map((item: any) => ({
          labTestId: item.labTestId?._id ? item.labTestId._id.toString() : item.labTestId?.toString() || item.labTestId,
          labTestDetails: item.labTestId?._id ? item.labTestId : null, // Store populated lab test data
          price: item.price || 0
        })),
        doc.deliveryAddress,
        doc.deliveryMethod,
        doc.totalAmount,
        doc.status,
        doc.estimatedDelivery,
        doc.collectionAddress,
        doc.trackingNumber,
        doc.createdAt,
        doc.updatedAt,
        doc.userId ? doc.userId.toString() : undefined,
        doc.patientId ? doc.patientId.toString() : undefined
      );

      console.log('🔍 LAB_TEST_ORDER_ENTITY: Conversion successful for:', doc._id);
      return result;
    } catch (error) {
      console.error('🔍 LAB_TEST_ORDER_ENTITY: Error converting document:', doc._id, error);
      throw error;
    }
  }
}