import { Schema } from 'mongoose';

const orderItemSchema = new Schema({
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

const orderSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  prescriptionId: {
    type: Schema.Types.ObjectId,
    ref: 'Prescription',
    required: true
  },
  items: [orderItemSchema],
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
    ref: 'User'
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
orderSchema.index({ orderId: 1 });
orderSchema.index({ prescriptionId: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 }); // Most recent orders first
orderSchema.index({ 'deliveryAddress.city': 1 });
orderSchema.index({ 'deliveryAddress.state': 1 });

export { orderSchema };