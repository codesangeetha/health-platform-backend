import mongoose from 'mongoose';
import { patientSchema } from './mongodb/schemas/patient.schema';

const PatientModel = mongoose.model('Patient', patientSchema);

export { PatientModel };