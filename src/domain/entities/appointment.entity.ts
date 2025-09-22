import { Types } from 'mongoose';

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly patientId: string, // ObjectId as string
    public readonly doctorId: string,  // ObjectId as string
    public readonly date: Date,
    public readonly time: string,
    public readonly isVideoCall: boolean = false,
    public readonly status: 'pending' | 'confirmed' | 'cancelled' | 'completed' = 'pending',
    public readonly reason?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly editedBy?: string // ObjectId as string
  ) {}

  // Convert to MongoDB document format
  public toMongoDocument() {
    return {
      patientId: new Types.ObjectId(this.patientId),
      doctorId: new Types.ObjectId(this.doctorId),
      date: this.date,
      time: this.time,
      isVideoCall: this.isVideoCall,
      status: this.status,
      reason: this.reason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      editedBy: this.editedBy ? new Types.ObjectId(this.editedBy) : undefined
    };
  }

  // Static method to create entity from MongoDB document
  static fromMongoDocument(doc: any): Appointment {
    return new Appointment(
      doc._id.toString(),
      doc.patientId.toString(),
      doc.doctorId.toString(),
      doc.date,
      doc.time,
      doc.isVideoCall,
      doc.status,
      doc.reason,
      doc.createdAt,
      doc.updatedAt,
      doc.editedBy ? doc.editedBy.toString() : undefined
    );
  }
}
