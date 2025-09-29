import mongoose from 'mongoose';
import { patientSchema } from './mongodb/schemas/patient.schema';
import { doctorSchema } from './mongodb/schemas/doctor.schema';
import { appointmentSchema } from './mongodb/schemas/appointment.shema';
import { pharmacyCategorySchema } from './mongodb/schemas/pharmacyCategory.schema';
import { medicineSchema } from './mongodb/schemas/medicine.schema';
import { prescriptionSchema } from './mongodb/schemas/prescription.schema';
import { orderSchema } from './mongodb/schemas/order.schema';

const PatientModel = mongoose.model('Patient', patientSchema);
const DoctorModel = mongoose.model('Doctor', doctorSchema);
const AppointmentModel = mongoose.model('Appointment', appointmentSchema);
const PharmacyCategoryModel = mongoose.model('PharmacyCategory', pharmacyCategorySchema);
const MedicineModel = mongoose.model('Medicine', medicineSchema);
const PrescriptionModel = mongoose.model('Prescription', prescriptionSchema);
const OrderModel = mongoose.model('Order', orderSchema);


export { PatientModel };
export { DoctorModel };
export { AppointmentModel };
export { PharmacyCategoryModel };
export { MedicineModel };
export { PrescriptionModel };
export { OrderModel };