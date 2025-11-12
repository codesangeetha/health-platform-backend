import { Schema, model } from 'mongoose';

const specializationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true // prevent duplicate specialization names
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

specializationSchema.index({ name: 1 }, { unique: true });

export const SpecializationModel = model('Specialization', specializationSchema);
export { specializationSchema };