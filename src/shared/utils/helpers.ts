import bcrypt from 'bcrypt';
import { UserRegistrationRequest } from '@/domain/types/authentication/user-registration.type';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const validatePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const validateRegistrationInput = (input: UserRegistrationRequest): void => {
  if (!input.email || !input.password || !input.firstName || !input.lastName) {
    throw new Error('Invalid input data');
  }

  if (!input.email.includes('@')) {
    throw new Error('Invalid email format');
  }

  if (input.password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
};