import { User } from './user.entity';

export class Patient extends User {
  constructor(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    whatsapp:string,
    dateOfBirth: Date,
    public readonly bloodGroup?: string,
    public readonly allergies: string[] = [],
    public readonly chronicDiseases: string[] = [],
    public readonly emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    }
  ) {
    super(id, email, 'patient', firstName, lastName, phone,whatsapp, dateOfBirth);
  }

  // Method to convert to MongoDB document format
  toMongoDocument() {
    return {
      // Don't include _id here - let MongoDB generate it
      email: this.email,
      userType: this.userType,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      whatsapp: this.whatsapp,
      dateOfBirth: this.dateOfBirth,
      isActive: this.isActive,
      bloodGroup: this.bloodGroup,
      allergies: this.allergies,
      chronicDiseases: this.chronicDiseases,
      emergencyContact: this.emergencyContact,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Static method to create from MongoDB document
  static fromMongoDocument(doc: any): Patient {
    return new Patient(
      doc._id, // Use MongoDB's _id
      doc.email,
      doc.firstName,
      doc.lastName,
      doc.phone,
      doc.whatsapp,
      doc.dateOfBirth,
      doc.bloodGroup,
      doc.allergies,
      doc.chronicDiseases,
      doc.emergencyContact
    );
  }
}