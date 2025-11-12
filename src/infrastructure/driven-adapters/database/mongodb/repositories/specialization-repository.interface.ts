export interface ISpecializationRepository {
    // Create a new specialization
    create(name: string): Promise<Specialization>;
    
    // Get all specializations
    findAll(options: {
        skip?: number;
        limit?: number;
        status?: 'active' | 'inactive';
        name?: string;
        createdAt?: {
            gte?: Date;
            lte?: Date;
        };
    }): Promise<Specialization[]>;
    
    // Find specialization by ID
    findById(id: string): Promise<Specialization | null>;
    
    // Update a specialization
    update(id: string, data: { name: string }): Promise<Specialization>;
    
    // Delete a specialization
    delete(id: string): Promise<void>;
    
    // Count specializations with filter
    count(filter: any): Promise<number>;
}

export interface Specialization {
    _id?: string;
    id?: string;
    name: string;
    status?: 'active' | 'inactive';
    createdAt: Date | string;
    updatedAt: Date | string;
}