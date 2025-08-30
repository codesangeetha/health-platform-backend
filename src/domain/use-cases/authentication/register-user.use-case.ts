import { IRegisterUserUseCase } from '../interfaces/authentication/register-user.use-case.interface';
import { IUserRepository } from '../interfaces/authentication/user-repository.interface';
import { PatientRegistrationRequest, DoctorRegistrationRequest, UserRegistrationResponse } from '@/domain/types/authentication/user-registration.type';
import { AppError } from '@/shared/errors/app-error';
import { hashPassword } from '@/shared/utils/helpers';
import { PatientModel, DoctorModel } from '@/infrastructure/driven-adapters/database';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  async execute(request: PatientRegistrationRequest | DoctorRegistrationRequest): Promise<UserRegistrationResponse> {
    // Validate input
    this.validateRegistrationRequest(request);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new AppError('Email already exists', 'USER_003', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(request.password);

    let savedUser;
    if (request.userType === 'patient') {
      const patientData = {
        ...request,
        password: hashedPassword,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      savedUser = await this.userRepository.create(patientData, PatientModel);
    } else {
      const doctorData = {
        ...request,
        password: hashedPassword,
        isVerified: false,
        rating: 0,
        totalPatients: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      savedUser = await this.userRepository.create(doctorData, DoctorModel);
    }

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

  private validateRegistrationRequest(request: PatientRegistrationRequest | DoctorRegistrationRequest): void {
    const commonFields = ['email', 'password', 'firstName', 'lastName', 'phone', 'dateOfBirth', 'userType'];
    for (const field of commonFields) {
      if (!request[field as keyof typeof request]) {
        throw new AppError(`Missing required field: ${field}`, 'USER_001', 400);
      }
    }

    if (!request.email.includes('@')) {
      throw new AppError('Invalid email format', 'USER_001', 400);
    }

    if (request.password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 'USER_001', 400);
    }

    if (request.userType === 'doctor') {
      const doctorRequest = request as DoctorRegistrationRequest;
      const doctorFields = ['specialization', 'licenseNumber', 'experience', 'consultationFee', 'qualification', 'hospital', 'availableDays', 'availableTime'];
      
      for (const field of doctorFields) {
        if (!doctorRequest[field as keyof typeof doctorRequest]) {
          throw new AppError(`Missing required doctor field: ${field}`, 'USER_001', 400);
        }
      }
    }

    if (request.userType === 'patient') {
      const patientRequest = request as PatientRegistrationRequest;
      if (!patientRequest.bloodGroup) {
        throw new AppError('Blood group is required for patients', 'USER_001', 400);
      }
    }
  }
}