import { User } from './user.entity';

export class Doctor extends User {
  constructor(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    dateOfBirth: Date,
    isVerified: boolean,
    public readonly specialization: string,
    public readonly licenseNumber: string,
    public readonly experience: string,
    public readonly consultationFee: number,
    public readonly qualification: string,
    public readonly hospital: string,
    public readonly availableDays: string[] = [],
    public readonly availableTime?: {
      start: string;
      end: string;
    },
    public readonly rating: number = 0,
    public readonly totalPatients: number = 0,
  ) {
    super(id, email, 'doctor', firstName, lastName, phone, dateOfBirth, isVerified);
  }

  // Convert Doctor entity to MongoDB document
  toMongoDocument() {
    return {
      email: this.email,
      userType: this.userType,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      dateOfBirth: this.dateOfBirth,
      isVerified: this.isVerified,
      specialization: this.specialization,
      licenseNumber: this.licenseNumber,
      experience: this.experience,
      consultationFee: this.consultationFee,
      qualification: this.qualification,
      hospital: this.hospital,
      availableDays: this.availableDays,
      availableTime: this.availableTime,
      rating: this.rating,
      totalPatients: this.totalPatients,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create Doctor entity from MongoDB document
  static fromMongoDocument(doc: any): Doctor {
    return new Doctor(
      doc._id, // MongoDB's ObjectId
      doc.email,
      doc.firstName,
      doc.lastName,
      doc.phone,
      doc.dateOfBirth,
      doc.isVerified,
      doc.specialization,
      doc.licenseNumber,
      doc.experience,
      doc.consultationFee,
      doc.qualification,
      doc.hospital,
      doc.availableDays,
      doc.availableTime,
      doc.rating,
      doc.totalPatients
    );
  }
}
