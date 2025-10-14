import { Types } from 'mongoose';

export class LabTest {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly categoryId: string, // ObjectId as string (reference to LabTestCategory)
        public readonly price: number = 0,
        public readonly description?: string,
        public readonly isActive: boolean = true,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date(),
        public readonly editedBy?: string // ObjectId as string
    ) { }

    // Convert to MongoDB document format
    public toMongoDocument() {
        return {
            name: this.name,
            categoryId: new Types.ObjectId(this.categoryId),
            price: this.price,
            description: this.description,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            editedBy: this.editedBy ? new Types.ObjectId(this.editedBy) : undefined
        };
    }

    // Static method to create entity from MongoDB document
    static fromMongoDocument(doc: any): LabTest {
        return new LabTest(
            doc._id.toString(),
            doc.name,
            doc.categoryId.toString(),
            doc.price,
            doc.description,
            doc.isActive,
            doc.createdAt,
            doc.updatedAt,
            doc.editedBy ? doc.editedBy.toString() : undefined
        );
    }
}