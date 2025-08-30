import mongoose from 'mongoose';

export interface IUserRepository {
  create(user: any, model: mongoose.Model<any>): Promise<any>;
  findByEmail(email: string): Promise<any>;
  findById(id: string): Promise<any>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
}