import { connectToDatabase } from '@/infrastructure/config/database/mongodb.config';

export const connectDB = async () => {
  try {
    await connectToDatabase();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};