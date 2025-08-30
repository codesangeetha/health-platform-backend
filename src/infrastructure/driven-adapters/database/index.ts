import mongoose from 'mongoose';
import { patientSchema } from './mongodb/schemas/patient.schema';
import { doctorSchema } from './mongodb/schemas/doctor.schema';

const PatientModel = mongoose.model('Patient', patientSchema);
const DoctorModel = mongoose.model('Doctor', doctorSchema);

export { PatientModel };
export { DoctorModel };