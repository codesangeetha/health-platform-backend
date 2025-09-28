import { Schema } from 'mongoose';

const prescriptionSchema = new Schema({
    prescriptionFileName: {
        type: String,
        required: true,
        trim: true
    }, // Stores the filename of the uploaded prescription file
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    }, // Reference to the doctor who issued the prescription
    notes: {
        type: String,
        trim: true
    }, // Optional notes about the prescription
    uploadDate: {
        type: Date,
        default: Date.now
    }, // When the prescription was uploaded
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    editedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,   // Auto-manages createdAt & updatedAt
    versionKey: false,
    _id: true
});

// Indexes for better query performance
prescriptionSchema.index({ doctorId: 1 });
prescriptionSchema.index({ uploadDate: -1 }); // Most recent uploads first
prescriptionSchema.index({ prescriptionFileName: 1 });

export { prescriptionSchema };