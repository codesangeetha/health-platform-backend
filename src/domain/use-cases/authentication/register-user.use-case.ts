import { IRegisterUserUseCase } from '../interfaces/authentication/register-user.use-case.interface';
import { IUserRepository } from '../interfaces/authentication/user-repository.interface';
import { PatientRegistrationRequest, UserRegistrationRequest, UserRegistrationResponse } from '@/domain/types/authentication/user-registration.type';
import { Patient } from '@/domain/entities/patient.entity';
import { AppError } from '@/shared/errors/app-error';
import { hashPassword } from '@/shared/utils/helpers';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: PatientRegistrationRequest): Promise<UserRegistrationResponse> {
    // Validate input
    this.validateRegistrationRequest(request);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new AppError('Email already exists', 'USER_003', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(request.password);

    // Create user entity based on user type
    let user;
    if (request.userType === 'patient') {
      user = new Patient(
        this.generateUserId(),
        request.email,
        request.firstName,
        request.lastName,
        request.phone,
        new Date(request.dateOfBirth),
        request.bloodGroup,
        request.allergies || [],
        request.chronicDiseases || [],
        request.emergencyContact
      );
    }

    // Save user to database
    const userToSave = {
      ...user,
      password: hashedPassword
    };

    const savedUser = await this.userRepository.create(userToSave);

    // Return response
    return {
      success: true,
      message: 'User registered successfully',
      data: {
        userId: savedUser._id,
        email: savedUser.email,
        userType: savedUser.userType,
        isVerified: savedUser.isVerified
      }
    };
  }

  private validateRegistrationRequest(request: UserRegistrationRequest): void {
    if (!request.email || !request.password || !request.firstName || !request.lastName) {
      throw new AppError('Invalid input data', 'USER_001', 400);
    }

    if (!request.email.includes('@')) {
      throw new AppError('Invalid email format', 'USER_001', 400);
    }

    if (request.password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 'USER_001', 400);
    }
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}