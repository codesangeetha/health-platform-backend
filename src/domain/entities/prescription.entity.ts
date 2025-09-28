import { Types } from 'mongoose';

export class Prescription {
    constructor(
        public readonly id: string,
        public readonly prescriptionFileName: string,
        public readonly doctorId: string,
        public readonly uploadDate: Date = new Date(),
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date(),
        public readonly notes?: string,
        public readonly editedBy?: string
    ) { }

    // Convert to MongoDB document format
    public toMongoDocument() {
        return {
            prescriptionFileName: this.prescriptionFileName,
            doctorId: new Types.ObjectId(this.doctorId),
            notes: this.notes,
            uploadDate: this.uploadDate,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            editedBy: this.editedBy ? new Types.ObjectId(this.editedBy) : undefined
        };
    }

    // Static method to create entity from MongoDB document
    static fromMongoDocument(doc: any): Prescription {
        return new Prescription(
            doc._id.toString(),
            doc.prescriptionFileName,
            doc.doctorId.toString(),
            doc.uploadDate,
            doc.createdAt,
            doc.updatedAt,
            doc.notes,
            doc.editedBy ? doc.editedBy.toString() : undefined
        );
    }
}