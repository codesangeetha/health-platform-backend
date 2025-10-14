import { Schema } from 'mongoose';

const medicineOrderItemSchema = new Schema({
  medicineId: {
    type: Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: false });

const deliveryAddressSchema = new Schema({
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const medicineOrderSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  orderType: {
    type: String,
    required: true,
    enum: ['medicine'],
    default: 'medicine'
  },
  prescriptionId: {
    type: Schema.Types.ObjectId,
    ref: 'Prescription',
    required: true
  },
  items: [medicineOrderItemSchema],
  deliveryAddress: deliveryAddressSchema,
  deliveryMethod: {
    type: String,
    required: true,
    enum: ['standard', 'express', 'urgent'],
    default: 'standard'
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  estimatedDelivery: {
    type: Date
  },
  paymentUrl: {
    type: String,
    trim: true
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,   // Auto-manages createdAt & updatedAt
  versionKey: false,
  _id: true
});

// Indexes for better query performance
medicineOrderSchema.index({ orderId: 1 });
medicineOrderSchema.index({ prescriptionId: 1 });
medicineOrderSchema.index({ userId: 1 });
medicineOrderSchema.index({ patientId: 1 });
medicineOrderSchema.index({ status: 1 });
medicineOrderSchema.index({ orderType: 1 });
medicineOrderSchema.index({ createdAt: -1 }); // Most recent orders first
medicineOrderSchema.index({ 'deliveryAddress.city': 1 });
medicineOrderSchema.index({ 'deliveryAddress.state': 1 });

export { medicineOrderSchema };