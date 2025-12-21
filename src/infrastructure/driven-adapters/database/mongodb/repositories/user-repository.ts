import { IUserRepository } from '@/domain/use-cases/interfaces/authentication/user-repository.interface';
import mongoose from 'mongoose';
import { PatientModel, DoctorModel } from '@/infrastructure/driven-adapters/database';

export class UserRepositoryMongoDB implements IUserRepository {
  async create(user: any, model: mongoose.Model<any>): Promise<any> {
    const createdUser = new model(user);
    await createdUser.save();
    return createdUser.toObject();
  }

  async findByEmail(email: string): Promise<any> {
   
    const patient = await PatientModel.findOne({ email }).lean();
    if (patient) return patient;

    const doctor = await DoctorModel.findOne({ email }).lean();
    return doctor;
  }

  async findByPhone(phone: string): Promise<any> {
   
    const patient = await PatientModel.findOne({ phone:phone }).lean();
    if (patient) return patient;

    const doctor = await DoctorModel.findOne({ phone:phone }).lean();
    return doctor;
  }

  async findByLicenseNumber(licenseNumber: string): Promise<any> {
    // License numbers are only for doctors, so we only search in DoctorModel
    return await DoctorModel.findOne({ licenseNumber }).lean();
  }

  async findById(id: string): Promise<any> {

     const patient = await PatientModel.findById(id).lean();
     if (patient) return patient;

     const doctor = await DoctorModel.findById(id).lean();
     return doctor;
   }

   async findByGoogleId(googleId: string): Promise<any> {
     const patient = await PatientModel.findOne({ googleId }).lean();
     if (patient) return patient;

     const doctor = await DoctorModel.findOne({ googleId }).lean();
     return doctor;
   }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    // Try updating in both collections
    const patientUpdate = await PatientModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        updatedAt: new Date()
      }
    );

    if (!patientUpdate) {
      // If not found in patients, try doctors
      await DoctorModel.findByIdAndUpdate(
        userId,
        {
          password: hashedPassword,
          updatedAt: new Date()
        }
      );
    }
  }
}