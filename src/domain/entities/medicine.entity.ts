import { Types } from 'mongoose';

export class Medicine {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly genericName: string,
        public readonly category: string, // ObjectId as string (categoryId)
        public readonly price: number = 0,
        public readonly stock: number = 0,
        public readonly sideEffects: string[] = [],
        public readonly interactions: string[] = [],
        public readonly ingredients: string[] = [],
        public readonly expiryDate: Date,
        public readonly status: 'active' | 'inactive' = 'active',
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date(),
        public readonly manufacturer?: string,
        public readonly description?: string,
        public readonly dosage?: string,
        public readonly storage?: string,
        public readonly editedBy?: string // ObjectId as string
    ) { }

    // Convert to MongoDB document format
    public toMongoDocument() {
        return {
            name: this.name,
            genericName: this.genericName,
            category: new Types.ObjectId(this.category),
            manufacturer: this.manufacturer,
            price: this.price,
            stock: this.stock,
            description: this.description,
            dosage: this.dosage,
            sideEffects: this.sideEffects,
            interactions: this.interactions,
            ingredients: this.ingredients,
            storage: this.storage,
            expiryDate: this.expiryDate,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            editedBy: this.editedBy ? new Types.ObjectId(this.editedBy) : undefined
        };
    }

    // Static method to create entity from MongoDB document
    static fromMongoDocument(doc: any): Medicine {
        return new Medicine(
            doc._id.toString(),
            doc.name,
            doc.genericName,
            doc.category.toString(),
            doc.price,
            doc.stock,
            doc.sideEffects || [],
            doc.interactions || [],
            doc.ingredients || [],
            doc.expiryDate,
            doc.status,
            doc.createdAt,
            doc.updatedAt,
            doc.manufacturer,
            doc.description,
            doc.dosage,
            doc.storage,
            doc.editedBy ? doc.editedBy.toString() : undefined
        );
    }
}


