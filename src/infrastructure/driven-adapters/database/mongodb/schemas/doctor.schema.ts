import { Schema } from 'mongoose';

const doctorSchema = new Schema({
  email: { type: String, required: true, unique: true },
  userType: { type: String, required: true, enum: ['doctor'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
  specialization: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  experience: { type: String, required: true },
  consultationFee: { type: Number, required: true },
  qualification: { type: String, required: true },
  hospital: { type: String, required: true },
  availableDays: [{ type: String, required: true }],
  availableTime: {
    start: { type: String },
    end: { type: String }
  },
  rating: { type: Number, default: 0 },
  totalPatients: { type: Number, default: 0 },
  password: { type: String, default: null }, // Optional for doctors, will be set via email link
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false,
  _id: true
});

// Indexes
doctorSchema.index({ email: 1 }, { unique: true });
doctorSchema.index({ licenseNumber: 1 }, { unique: true });

export { doctorSchema };
