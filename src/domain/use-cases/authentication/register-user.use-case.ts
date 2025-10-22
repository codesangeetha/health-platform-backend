import { IRegisterUserUseCase } from '../interfaces/authentication/register-user.use-case.interface';
import { IUserRepository } from '../interfaces/authentication/user-repository.interface';
import { PatientRegistrationRequest, DoctorRegistrationRequest, UserRegistrationResponse } from '@/domain/types/authentication/user-registration.type';
import { AppError } from '@/shared/errors/app-error';
import { hashPassword } from '@/shared/utils/helpers';
import { PatientModel, DoctorModel } from '@/infrastructure/driven-adapters/database';
import { IEmailService } from '@/infrastructure/driven-adapters/email/email.service.interface';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(request: PatientRegistrationRequest | DoctorRegistrationRequest): Promise<UserRegistrationResponse> {
    // Validate input
    this.validateRegistrationRequest(request);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new AppError('Email already exists', 'USER_003', 409);
    }

    const existingPhoneUser = await this.userRepository.findByPhone(request.phone);
    if (existingPhoneUser) {
      throw new AppError('phone number already exists', 'USER_003', 409);
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

const emailSubject = 'Welcome to Health Platform';
    const emailContent = `
      <html>
        <body>
          <h2>Welcome to Health Platform!</h2>
          <p>Dear ${request.firstName},</p>
          <p>Thank you for registering with Health Platform. Your account has been successfully created.</p>
          <p>You can now login to access our services and manage your healthcare needs.</p>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <br>
          <p>Best regards,</p>
          <p>Health Platform Team</p>
        </body>
      </html>
    `;

    try {
      await this.emailService.sendEmail(request.email, emailSubject, emailContent);
    } catch (error) {
      // Log error but don't fail registration if email fails
      console.error('Failed to send welcome email:', error);
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