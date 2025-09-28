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
  category?: string // <-- new filter
): Promise<{ medicines: Medicine[]; total: number }> {
  try {
    const skip = (page - 1) * limit;

    // Build filter conditions dynamically
    const filter: any = {};
    if (status) filter.status = status;
    if (name) filter.name = { $regex: name, $options: 'i' }; // case-insensitive search
    if (category) filter.category = category; // exact match with categoryId

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



}
