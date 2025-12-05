import { Schema } from 'mongoose';

const labTestOrderItemSchema = new Schema({
  labTestId: {
    type: Schema.Types.ObjectId,
    ref: 'LabTest',
    required: true
  },
  labTestName: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  result: {
    type: String,
    trim: true
  },
  testStatus: {
    type: String,
    enum: ['pending', 'completed', 'skipped'],
    default: 'pending'
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

const labTestOrderSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  orderType: {
    type: String,
    required: true,
    enum: ['lab_test'],
    default: 'lab_test'
  },
  prescriptionId: {
    type: Schema.Types.ObjectId,
    ref: 'Prescription',
    required: true
  },
  items: [labTestOrderItemSchema],
  deliveryAddress: deliveryAddressSchema,
  collectionMethod: {
    type: String,
    required: true,
    enum: ['home_collection', 'lab_visit'],
    default: 'lab_visit'
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'sample_collected', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  scheduledDate: {
    type: Date
  },
  collectionAddress: deliveryAddressSchema,
  trackingNumber: {
    type: String,
    trim: true
  },
  reason: {
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
labTestOrderSchema.index({ orderId: 1 });
labTestOrderSchema.index({ prescriptionId: 1 });
labTestOrderSchema.index({ userId: 1 });
labTestOrderSchema.index({ patientId: 1 });
labTestOrderSchema.index({ status: 1 });
labTestOrderSchema.index({ orderType: 1 });
labTestOrderSchema.index({ createdAt: -1 }); // Most recent orders first
labTestOrderSchema.index({ 'deliveryAddress.city': 1 });
labTestOrderSchema.index({ 'deliveryAddress.state': 1 });

export { labTestOrderSchema };