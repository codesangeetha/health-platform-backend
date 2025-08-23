import { Schema } from 'mongoose';

const patientSchema = new Schema({
  email: { type: String, required: true, unique: true },
  userType: { type: String, required: true, enum: ['patient', 'doctor', 'admin'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
  bloodGroup: { type: String },
  allergies: [{ type: String }],
  chronicDiseases: [{ type: String }],
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phone: { type: String }
  },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false,
  _id: true // Let MongoDB auto-generate the _id
});

// Add index at the schema level, not field level
patientSchema.index({ email: 1 }, { unique: true });

export { patientSchema };