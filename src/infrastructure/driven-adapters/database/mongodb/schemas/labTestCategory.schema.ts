import { Schema, model } from 'mongoose';

const labTestCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true // prevent duplicate category names
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  editedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,   // auto-manages createdAt & updatedAt
  versionKey: false,
  _id: true
});

labTestCategorySchema.index({ name: 1 }, { unique: true });

export const LabTestCategoryModel = model('LabTestCategory', labTestCategorySchema);
export { labTestCategorySchema };