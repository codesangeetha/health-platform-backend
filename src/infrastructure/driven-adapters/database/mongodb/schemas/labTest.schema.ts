import { Schema, model } from 'mongoose';

const labTestSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'LabTestCategory',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  editedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,   // auto-manages createdAt & updatedAt
  versionKey: false,
  _id: true
});

labTestSchema.index({ name: 1, categoryId: 1 }, { unique: true });
labTestSchema.index({ categoryId: 1 });
labTestSchema.index({ isActive: 1 });

export const LabTestModel = model('LabTest', labTestSchema);
export { labTestSchema };