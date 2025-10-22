import { Types } from 'mongoose';

export class PharmacyCategory {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description?: string,
    public readonly status: 'active' | 'inactive' = 'active',
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly editedBy?: string // ObjectId as string
  ) {}

  // Convert to MongoDB document format
  public toMongoDocument() {
    return {
      name: this.name,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      editedBy: this.editedBy ? new Types.ObjectId(this.editedBy) : undefined
    };
  }

  // Static method to create entity from MongoDB document
  static fromMongoDocument(doc: any): PharmacyCategory {
    return new PharmacyCategory(
      doc._id.toString(),
      doc.name,
      doc.description,
      doc.status,
      doc.createdAt,
      doc.updatedAt,
      doc.editedBy ? doc.editedBy.toString() : undefined
    );
  }
}
