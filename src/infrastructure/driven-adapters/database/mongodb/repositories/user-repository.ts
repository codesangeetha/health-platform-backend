import { IUserRepository } from '@/domain/use-cases/interfaces/authentication/user-repository.interface';
import { User } from '@/domain/entities/user.entity';
import { Patient } from '@/domain/entities/patient.entity';
import { patientSchema } from '../schemas/patient.schema';

export class UserRepositoryMongoDB implements IUserRepository {
  constructor(private readonly userModel: any) { }

  async create(user: any): Promise<any> {
    const createdUser = new this.userModel(user);
    await createdUser.save();
    return createdUser.toObject();
  }

  async findByEmail(email: string): Promise<any> {
    return await this.userModel.findOne({ email }).lean();
  }

  async findById(id: string): Promise<any> {
    return await this.userModel.findById(id).lean();
  }


  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        updatedAt: new Date()
      }
    );

  }

}