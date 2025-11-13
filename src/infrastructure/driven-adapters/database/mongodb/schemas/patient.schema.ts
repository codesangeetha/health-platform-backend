import { Schema } from 'mongoose';

const patientSchema = new Schema({
  email: { type: String, required: true, unique: true },
  userType: { type: String, required: true, enum: ['patient'] },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  bloodGroup: { type: String },
  allergies: [{ type: String }],
  chronicDiseases: [{ type: String }],
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phone: { type: String }
  },
  password: { type: String, required: false }, // Optional for OAuth users
  googleId: { type: String, unique: true, sparse: true }, // For Google OAuth users
  profilePicture: { type: String }, // For OAuth profile pictures
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false,
  _id: true // Let MongoDB auto-generate the _id
});

// Indexes are handled by mongoose unique constraints in the schema fields

export { patientSchema };