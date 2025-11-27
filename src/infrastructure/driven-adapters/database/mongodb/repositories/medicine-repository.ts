import { AppError } from '@/shared/errors/app-error';
import { Medicine } from '@/domain/entities/medicine.entity';
import { IMedicineRepository } from './medicine-repository.interface';

export class MedicineRepositoryMongoDB implements IMedicineRepository {
  constructor(private readonly medicineModel: any) {}

  async create(medicine: any): Promise<Medicine> {
    try {
      // Save into MongoDB
      const doc = await this.medicineModel.create(medicine);

      // Convert back to entity
      return Medicine.fromMongoDocument(doc.toObject());
    } catch (error) {
      console.error("Database error (create medicine):", error);
      throw new AppError('Database error', 'DATABASE_ERROR', 500);
    }
  }

async findAll(
  page: number,
  limit: number,
  status?: 'active' | 'inactive',
  name?: string,
  category?: string,
  genericName?: string,
  fromDate?: string,
  toDate?: string
): Promise<{ medicines: Medicine[]; total: number }> {
  try {
    const skip = (page - 1) * limit;

    // Build filter conditions dynamically
    const filter: any = {};
    if (status) filter.status = status;
    if (name) filter.name = { $regex: name, $options: 'i' }; // case-insensitive search
    if (category) filter.category = category; // exact match with categoryId
    if (genericName) filter.genericName = { $regex: genericName, $options: 'i' }; // case-insensitive search
    
    // Date range filter
    if (fromDate || toDate) {
      const dateCondition: any = {};
      if (fromDate) {
        dateCondition.$gte = new Date(fromDate);
      }
      if (toDate) {
        // Add end of day for the end date
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        dateCondition.$lte = endDate;
      }
      filter.createdAt = dateCondition;
    }

    // Fetch data & count total
    const [docs, total] = await Promise.all([
      this.medicineModel.find(filter).skip(skip).limit(limit).lean(),
      this.medicineModel.countDocuments(filter),
    ]);

    // Convert documents to entities
    const medicines = docs.map((doc: any) => Medicine.fromMongoDocument(doc));

    return { medicines, total };
  } catch (error) {
    console.error('Database error (findAll medicines):', error);
    throw new AppError('Database error', 'DATABASE_ERROR', 500);
  }
}

async findById(id: string): Promise<Medicine | null> {
   try {
     const doc = await this.medicineModel.findById(id).lean();

     if (!doc) return null;

     return Medicine.fromMongoDocument(doc);
   } catch (error) {
     console.error('Database error (findById medicine):', error);
     throw new AppError('Database error', 'DATABASE_ERROR', 500);
   }
 }

 async searchMedicines(
   page: number,
   limit: number,
   query?: string,
   category?: string,
   name?: string,
   genericName?: string,
   priceMin?: number,
   priceMax?: number,
   stockMin?: number,
   stockMax?: number,
   createdDateFrom?: string,
   createdDateTo?: string,
   sortBy?: 'name' | 'genericName' | 'price' | 'stock' | 'createdAt',
   sortOrder?: 'asc' | 'desc'
 ): Promise<{ medicines: Medicine[]; total: number }> {
   try {
     const skip = (page - 1) * limit;

     // Build filter conditions dynamically
     const filter: any = { status: 'active' }; // Only search active medicines

     // Handle text search and other filters separately to avoid MongoDB conflicts
     const conditions: any[] = [{ status: 'active' }];

     // Text search query (search in both name and genericName fields)
     if (query) {
       conditions.push({
         $or: [
           { name: { $regex: query, $options: 'i' } },
           { genericName: { $regex: query, $options: 'i' } }
         ]
       });
     }

     // Category filter
     if (category) {
       conditions.push({ category: category });
     }

     // Name filter (exact match or partial match)
     if (name) {
       conditions.push({ name: { $regex: name, $options: 'i' } });
     }

     // Generic name filter (exact match or partial match)
     if (genericName) {
       conditions.push({ genericName: { $regex: genericName, $options: 'i' } });
     }

     // Price range filter
     if (priceMin !== undefined || priceMax !== undefined) {
       const priceCondition: any = {};
       if (priceMin !== undefined) priceCondition.$gte = priceMin;
       if (priceMax !== undefined) priceCondition.$lte = priceMax;
       conditions.push({ price: priceCondition });
     }

     // Stock range filter
     if (stockMin !== undefined || stockMax !== undefined) {
       const stockCondition: any = {};
       if (stockMin !== undefined) stockCondition.$gte = stockMin;
       if (stockMax !== undefined) stockCondition.$lte = stockMax;
       conditions.push({ stock: stockCondition });
     }

     // Created date range filter
     if (createdDateFrom || createdDateTo) {
       const dateCondition: any = {};
       if (createdDateFrom) {
         dateCondition.$gte = new Date(createdDateFrom);
       }
       if (createdDateTo) {
         // Add end of day for the end date
         const endDate = new Date(createdDateTo);
         endDate.setHours(23, 59, 59, 999);
         dateCondition.$lte = endDate;
       }
       conditions.push({ createdAt: dateCondition });
     }

     // Combine all conditions with $and
     filter.$and = conditions;

     // Build sort object
     let sort: any = { createdAt: -1 }; // default sort by createdAt descending
     if (sortBy && sortOrder) {
       sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
     }

     // Fetch data & count total
     const [docs, total] = await Promise.all([
       this.medicineModel.find(filter)
         .sort(sort)
         .skip(skip)
         .limit(limit)
         .lean(),
       this.medicineModel.countDocuments(filter),
     ]);

     // Convert documents to entities
     const medicines = docs.map((doc: any) => Medicine.fromMongoDocument(doc));

     return { medicines, total };
   } catch (error) {
     console.error('Database error (searchMedicines):', error);
     throw new AppError('Database error', 'DATABASE_ERROR', 500);
   }
 }

 async updateInventory(
   id: string,
   updates: {
     stock?: number;
     price?: number;
     status?: 'active' | 'inactive';
   }
 ): Promise<Medicine> {
   try {
     // Build update object dynamically
     const updateData: any = {
       updatedAt: new Date()
     };

     if (updates.stock !== undefined) updateData.stock = updates.stock;
     if (updates.price !== undefined) updateData.price = updates.price;
     if (updates.status !== undefined) updateData.status = updates.status;

     // Update the medicine in database
     const doc = await this.medicineModel.findByIdAndUpdate(
       id,
       updateData,
       { new: true, runValidators: true } // Return updated document and run validators
     ).lean();

     if (!doc) {
       throw new AppError('Medicine not found', 'MEDICINE_NOT_FOUND', 404);
     }

     return Medicine.fromMongoDocument(doc);
   } catch (error) {
     if (error instanceof AppError) {
       throw error;
     }
     console.error('Database error (updateInventory):', error);
     throw new AppError('Database error', 'DATABASE_ERROR', 500);
   }
 }

 async update(
   id: string,
   updates: {
     name?: string;
     genericName?: string;
     category?: string;
     manufacturer?: string;
     price?: number;
     description?: string;
     dosage?: string;
     sideEffects?: string[];
     interactions?: string[];
     ingredients?: string[];
     storage?: string;
     status?: 'active' | 'inactive';
   }
 ): Promise<Medicine> {
   try {
     // Build update object dynamically
     const updateData: any = {
       updatedAt: new Date()
     };

     if (updates.name !== undefined) updateData.name = updates.name;
     if (updates.genericName !== undefined) updateData.genericName = updates.genericName;
     if (updates.category !== undefined) updateData.category = updates.category;
     if (updates.manufacturer !== undefined) updateData.manufacturer = updates.manufacturer;
     if (updates.price !== undefined) updateData.price = updates.price;
     if (updates.description !== undefined) updateData.description = updates.description;
     if (updates.dosage !== undefined) updateData.dosage = updates.dosage;
     if (updates.sideEffects !== undefined) updateData.sideEffects = updates.sideEffects;
     if (updates.interactions !== undefined) updateData.interactions = updates.interactions;
     if (updates.ingredients !== undefined) updateData.ingredients = updates.ingredients;
     if (updates.storage !== undefined) updateData.storage = updates.storage;
     if (updates.status !== undefined) updateData.status = updates.status;

     // Update the medicine in database
     const doc = await this.medicineModel.findByIdAndUpdate(
       id,
       updateData,
       { new: true, runValidators: true } // Return updated document and run validators
     ).lean();

     if (!doc) {
       throw new AppError('Medicine not found', 'MEDICINE_NOT_FOUND', 404);
     }

     return Medicine.fromMongoDocument(doc);
   } catch (error) {
     if (error instanceof AppError) {
       throw error;
     }
     console.error('Database error (update medicine):', error);
     throw new AppError('Database error', 'DATABASE_ERROR', 500);
   }
 }

 async delete(id: string): Promise<Medicine> {
   try {
     // Find the medicine first to return it after deletion
     const medicineToDelete = await this.findById(id);
     if (!medicineToDelete) {
       throw new AppError('Medicine not found', 'MEDICINE_NOT_FOUND', 404);
     }

     // Delete the medicine from database
     const deletedDoc = await this.medicineModel.findByIdAndDelete(id).lean();

     if (!deletedDoc) {
       throw new AppError('Medicine not found', 'MEDICINE_NOT_FOUND', 404);
     }

     return Medicine.fromMongoDocument(deletedDoc);
   } catch (error) {
     if (error instanceof AppError) {
       throw error;
     }
     console.error('Database error (delete medicine):', error);
     throw new AppError('Database error', 'DATABASE_ERROR', 500);
   }
 }

 async count(): Promise<number> {
   try {
     return await this.medicineModel.countDocuments();
   } catch (error) {
     throw new AppError('Database error', 'DATABASE_ERROR', 500);
   }
 }
}
