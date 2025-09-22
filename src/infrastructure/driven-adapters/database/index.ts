import mongoose from 'mongoose';
import { patientSchema } from './mongodb/schemas/patient.schema';
import { doctorSchema } from './mongodb/schemas/doctor.schema';
import { appointmentSchema } from './mongodb/schemas/appointment.shema';


const PatientModel = mongoose.model('Patient', patientSchema);
const DoctorModel = mongoose.model('Doctor', doctorSchema);
const AppointmentModel = mongoose.model('Appointment',appointmentSchema);

export { PatientModel };
export { DoctorModel };
export {AppointmentModel};