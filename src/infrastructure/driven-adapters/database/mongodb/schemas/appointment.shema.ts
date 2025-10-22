import { Schema } from 'mongoose';

const appointmentSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g., "09:00"
  isVideoCall: { type: Boolean, default: false }, // true = video, false = in-person
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  reason: { type: String },
  symptoms: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  editedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,   // auto-manages createdAt & updatedAt
  versionKey: false,
  _id: true
});

// Optional: add indexes for faster lookups
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ date: 1, time: 1 }, { unique: true }); // Prevent double booking

export { appointmentSchema };
