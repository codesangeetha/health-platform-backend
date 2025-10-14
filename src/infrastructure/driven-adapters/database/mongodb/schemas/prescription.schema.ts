import { Schema } from 'mongoose';

// Medicine sub-schema for prescription medicines
const medicineSchema = new Schema({
    medicineId: {
        type: Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    name: {
        type: String,
        required: false,  // Made optional
        trim: true
    },
    dosage: {
        type: String,
        required: true,
        trim: true
    },
    timing: [{
        type: String,
        enum: ['morning', 'afternoon', 'evening', 'night'],
        required: true
    }],
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    mealTime: {
        type: String,
        enum: ['before meal', 'after meal', 'with meal'],
        required: true
    }
}, { _id: false });

const prescriptionSchema = new Schema({
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    diagnosis: {
        type: String,
        required: true,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    medicines: [medicineSchema],
    tests: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['Created', 'Dispensed', 'Cancelled'],
        default: 'Created'
    }
}, {
    timestamps: true,
    versionKey: false,
    _id: true
});

// Indexes for better query performance
prescriptionSchema.index({ doctorId: 1 });
prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ appointmentId: 1 });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ createdAt: -1 });

export { prescriptionSchema };