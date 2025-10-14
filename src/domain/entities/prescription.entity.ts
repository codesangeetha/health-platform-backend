import { Types } from 'mongoose';

// Medicine interface for prescription medicines
export interface PrescriptionMedicine {
    medicineId: string;
    name?: string;  // Optional - can be populated from medicine collection
    dosage: string;
    timing: string[];
    duration: number;
    mealTime: 'before meal' | 'after meal' | 'with meal';
}

export class Prescription {
    constructor(
        public readonly id: string,
        public readonly appointmentId: string,
        public readonly doctorId: string,
        public readonly patientId: string,
        public readonly diagnosis: string,
        public readonly medicines: PrescriptionMedicine[],
        public readonly status: 'Created' | 'Dispensed' | 'Cancelled' = 'Created',
        public readonly notes?: string,
        public readonly tests?: string[],
        public readonly prescriptionFileName?: string,
        public readonly uploadDate?: Date,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date()
    ) { }

    // Convert to MongoDB document format
    public toMongoDocument() {
        return {
            appointmentId: new Types.ObjectId(this.appointmentId),
            doctorId: new Types.ObjectId(this.doctorId),
            patientId: new Types.ObjectId(this.patientId),
            diagnosis: this.diagnosis,
            notes: this.notes,
            medicines: this.medicines.map(medicine => ({
                medicineId: new Types.ObjectId(medicine.medicineId),
                name: medicine.name,
                dosage: medicine.dosage,
                timing: medicine.timing,
                duration: medicine.duration,
                mealTime: medicine.mealTime
            })),
            tests: this.tests,
            prescriptionFileName: this.prescriptionFileName,
            uploadDate: this.uploadDate,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Static method to create entity from MongoDB document
    static fromMongoDocument(doc: any): Prescription {
        // Validate required fields
        if (!doc) {
            throw new Error('PRESCRIPTION_NOT_FOUND');
        }

        if (!doc._id) {
            throw new Error('PRESCRIPTION_INVALID_ID');
        }

        // Handle missing appointmentId - this might indicate data inconsistency
        if (!doc.appointmentId) {
            throw new Error('PRESCRIPTION_MISSING_APPOINTMENT');
        }

        if (!doc.doctorId) {
            throw new Error('PRESCRIPTION_MISSING_DOCTOR');
        }

        if (!doc.patientId) {
            throw new Error('PRESCRIPTION_MISSING_PATIENT');
        }

        if (!doc.diagnosis) {
            throw new Error('PRESCRIPTION_MISSING_DIAGNOSIS');
        }

        return new Prescription(
            doc._id.toString(),
            doc.appointmentId.toString(),
            doc.doctorId.toString(),
            doc.patientId.toString(),
            doc.diagnosis,
            doc.medicines || [],
            doc.status || 'Created',
            doc.notes,
            doc.tests,
            doc.prescriptionFileName,
            doc.uploadDate,
            doc.createdAt || new Date(),
            doc.updatedAt || new Date()
        );
    }
}