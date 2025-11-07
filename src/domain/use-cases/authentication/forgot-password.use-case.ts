import { IForgotPasswordUseCase } from '../interfaces/authentication/forgot-password.use-case.interface';
import { IUserRepository } from '../interfaces/authentication/user-repository.interface';
import { IJwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service.interface';
import { ForgotPasswordRequest, ForgotPasswordResponse } from '@/domain/types/authentication/forgot-password.type';
import { IEmailService } from '@/infrastructure/driven-adapters/email/email.service.interface';
import { AppError } from '@/shared/errors/app-error';

export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
    private readonly emailService: IEmailService
  ) { }

  async execute(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {

    // Validate input
    this.validateForgotPasswordRequest(request);

    // Find user by email
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      // Return error for unregistered users
      return {
        success: false,
        message: 'User is not registered with this email address',
        errorCode: 'USER_NOT_FOUND'
      };
    }

    // Generate reset token (expires in 1 hour)
    const resetTokenPayload = { userId: user._id, email: user.email, purpose: 'password_reset' };
   
    const resetToken = await this.jwtService.signToken(resetTokenPayload);

    // Create reset link (in a real app, this would be your frontend URL)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    // Send email with reset link
    const emailSubject = 'Password Reset Request';
    const emailMessage = `Hello,\n\nYou requested a password reset. Please click the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nThank you,\nHealth Platform Team`;
    
    await this.emailService.sendEmail(user.email, emailSubject, emailMessage);


    return {
      success: true,
      message: 'Please check your mailbox you will receive a link shortly.'
    };

  }


  private validateForgotPasswordRequest(request: ForgotPasswordRequest): void {
    if (!request.email) {
      throw new AppError('Email is required', 'MISSING_EMAIL', 400);
    }

    if (!request.email.includes('@')) {
      throw new AppError('Invalid email format', 'INVALID_EMAIL', 400);
    }
  }
}

