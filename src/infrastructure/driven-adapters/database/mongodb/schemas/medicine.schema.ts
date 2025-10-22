import { Schema } from 'mongoose';

const medicineSchema = new Schema({
  name: { type: String, required: true, trim: true },
  genericName: { type: String, required: true, trim: true },
  category: { type: Schema.Types.ObjectId, ref: 'PharmacyCategory', required: true }, // relation
  manufacturer: { type: String, trim: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  description: { type: String, trim: true },
  dosage: { type: String, trim: true },
  sideEffects: [{ type: String, trim: true }],
  interactions: [{ type: String, trim: true }],
  ingredients: [{ type: String, trim: true }],
  storage: { type: String, trim: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  editedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,   // auto manages createdAt & updatedAt
  versionKey: false,
  _id: true
});

// Optional indexes
medicineSchema.index({ name: 1, genericName: 1 });
medicineSchema.index({ category: 1 });
medicineSchema.index({ status: 1 });

export { medicineSchema };
