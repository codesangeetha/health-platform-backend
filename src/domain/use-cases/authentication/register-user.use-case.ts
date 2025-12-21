import { IRegisterUserUseCase } from '../interfaces/authentication/register-user.use-case.interface';
import { IUserRepository } from '../interfaces/authentication/user-repository.interface';
import { PatientRegistrationRequest, DoctorRegistrationRequest, UserRegistrationResponse } from '@/domain/types/authentication/user-registration.type';
import { AppError } from '@/shared/errors/app-error';
import { hashPassword } from '@/shared/utils/helpers';
import { PatientModel, DoctorModel } from '@/infrastructure/driven-adapters/database';
import { IEmailService } from '@/infrastructure/driven-adapters/email/email.service.interface';
import { IJwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service.interface';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService,
    private readonly jwtService: IJwtService
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

    // Check for duplicate license number for doctors
    if (request.userType === 'doctor') {
      const doctorRequest = request as DoctorRegistrationRequest;
      const existingLicenseDoctor = await this.userRepository.findByLicenseNumber(doctorRequest.licenseNumber);
      if (existingLicenseDoctor) {
        throw new AppError('License number already exists', 'USER_004', 409);
      }
    }

    let savedUser;
    
    if (request.userType === 'patient') {
      // For patients, password is required
      const patientData = {
        ...request,
        password: await hashPassword(request.password),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      savedUser = await this.userRepository.create(patientData, PatientModel);
      
      // Send welcome email to patient
      const emailSubject = 'Welcome to Health Platform';
      const emailContent = `
        <html>
          <body>
            <h2>Welcome to Health Platform!</h2>
            <p>Dear ${request.firstName},</p>
            <p>Thank you for registering with Health Platform. Your account has been successfully created.</p>
            <p>You can now login to access our services and manage your healthcare needs.</p>
            <br>
            <p><a href="https://health-platform-frontend.vercel.app/patient/login" target="_blank" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Login to Your Account</a></p>
            <br>
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
        console.error('Failed to send welcome email:', error);
      }
    } else {
      // For doctors, password is optional - we'll send setup link via email
      const doctorData = {
        ...request,
        password: null, // No password initially
        isActive: true,
        rating: 0,
        totalPatients: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      savedUser = await this.userRepository.create(doctorData, DoctorModel);
      
      // Send password setup email to doctor
      const resetTokenPayload = { userId: savedUser._id, email: savedUser.email, purpose: 'doctor_password_setup' };
      const resetToken = await this.jwtService.signToken(resetTokenPayload);
      
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/set-doctor-password?token=${resetToken}`;
      
      const emailSubject = 'Doctor Registration - Set Your Password';
      const emailContent = `
        <html>
          <body>
            <h2>Welcome to Health Platform!</h2>
            <p>Dear Dr. ${request.firstName} ${request.lastName},</p>
            <p>Thank you for registering as a doctor with Health Platform. Your account has been successfully created.</p>
            <p>To complete your registration and access your doctor portal, please set up your password by clicking the link below:</p>
            <br>
            <p><a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Set Up Password</a></p>
            <br>
            <p>This link will expire in 24 hours for security purposes.</p>
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
        console.error('Failed to send password setup email:', error);
      }
    }

    return {
      success: true,
      message: request.userType === 'doctor'
        ? 'Doctor registered successfully. Please check your email to set up your password.'
        : 'User registered successfully',
      data: {
        userId: savedUser._id,
        email: savedUser.email,
        userType: savedUser.userType,
        isActive: savedUser.isActive
      }
    };
  }

  private validateRegistrationRequest(request: PatientRegistrationRequest | DoctorRegistrationRequest): void {
    const commonFields = ['email', 'firstName', 'lastName', 'phone', 'dateOfBirth', 'userType'];
    for (const field of commonFields) {
      if (!request[field as keyof typeof request]) {
        throw new AppError(`Missing required field: ${field}`, 'USER_001', 400);
      }
    }

    if (!request.email.includes('@')) {
      throw new AppError('Invalid email format', 'USER_001', 400);
    }

    // Password is required for patients but optional for doctors
    if (request.userType === 'patient' && !request.password) {
      throw new AppError('Password is required for patients', 'USER_001', 400);
    }
    
    if (request.userType === 'patient' && request.password && request.password.length < 8) {
      throw new AppError('Password must be at least 8 characters long', 'USER_001', 400);
    }

    if (request.userType === 'doctor') {
      const doctorRequest = request as DoctorRegistrationRequest;
      const doctorFields = ['specialization', 'licenseNumber', 'experience', 'consultationFee', 'qualification', 'availableDays', 'availableTime'];
      
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