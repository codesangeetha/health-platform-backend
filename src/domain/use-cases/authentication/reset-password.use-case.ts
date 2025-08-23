import { IResetPasswordUseCase } from '../interfaces/authentication/reset-password.use-case.interface';
import { IUserRepository } from '../interfaces/authentication/user-repository.interface';
import { IJwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service.interface';
import { ResetPasswordRequest, ResetPasswordResponse } from '@/domain/types/authentication/reset-password.type';
import { AppError } from '@/shared/errors/app-error';
import { hashPassword } from '@/shared/utils/helpers';

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService
  ) {}

  async execute(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    // Validate input
    this.validateResetPasswordRequest(request);

    // Verify JWT token
    let decodedToken: any;
    try {
      decodedToken = await this.jwtService.verifyToken(request.token);
    } catch (error) {
      throw new AppError('Invalid or expired reset token', 'INVALID_TOKEN', 401);
    }

    // Check if token is for password reset
    if (decodedToken.purpose !== 'password_reset') {
      throw new AppError('Invalid token purpose', 'INVALID_TOKEN', 401);
    }

    // Find user by ID from token
    const user = await this.userRepository.findById(decodedToken.userId);
    if (!user) {
      throw new AppError('User not found', 'USER_NOT_FOUND', 404);
    }

    // Hash the new password
    const hashedPassword = await hashPassword(request.newPassword);

    // Update user's password
    await this.userRepository.updatePassword(user._id, hashedPassword);

    return {
      success: true,
      message: 'Password has been reset successfully'
    };
  }

  private validateResetPasswordRequest(request: ResetPasswordRequest): void {
    if (!request.token || !request.newPassword || !request.confirmPassword) {
      throw new AppError('Token, new password, and confirm password are required', 'MISSING_FIELDS', 400);
    }

    if (request.newPassword !== request.confirmPassword) {
      throw new AppError('New password and confirm password do not match', 'PASSWORD_MISMATCH', 400);
    }

    // Validate password strength (minimum 8 characters, at least one uppercase, one lowercase, one number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(request.newPassword)) {
      throw new AppError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number', 'INVALID_PASSWORD', 400);
    }
  }
}