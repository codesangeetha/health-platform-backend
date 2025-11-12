import { IDoctorPasswordSetUseCase } from '../interfaces/authentication/doctor-password-set.use-case.interface';
import { IUserRepository } from '../interfaces/authentication/user-repository.interface';
import { IJwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service.interface';
import { DoctorPasswordSetRequest, DoctorPasswordSetResponse } from '@/domain/types/authentication/doctor-password-set.type';
import { AppError } from '@/shared/errors/app-error';
import { hashPassword } from '@/shared/utils/helpers';

export class DoctorPasswordSetUseCase implements IDoctorPasswordSetUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService
  ) {}

  async execute(request: DoctorPasswordSetRequest): Promise<DoctorPasswordSetResponse> {
    // Validate input
    this.validateDoctorPasswordSetRequest(request);

    // Verify JWT token
    let decodedToken: any;
    try {
      decodedToken = await this.jwtService.verifyToken(request.token);
    } catch (error) {
      throw new AppError('Invalid or expired token', 'INVALID_TOKEN', 401);
    }

    // Check if token is for doctor password setup or regular password reset
    if (decodedToken.purpose !== 'doctor_password_setup' && decodedToken.purpose !== 'password_reset') {
      throw new AppError('Invalid token purpose for doctor password setup', 'INVALID_TOKEN', 401);
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
      message: decodedToken.purpose === 'doctor_password_setup'
        ? 'Password has been set up successfully. You can now log in to your doctor portal.'
        : 'Doctor password has been set successfully. You can now log in to your doctor portal.'
    };
  }

  private validateDoctorPasswordSetRequest(request: DoctorPasswordSetRequest): void {
    if (!request.token || !request.newPassword || !request.confirmPassword) {
      throw new AppError('Token, new password, and confirm password are required', 'MISSING_FIELDS', 400);
    }

    if (request.newPassword !== request.confirmPassword) {
      throw new AppError('New password and confirm password do not match', 'PASSWORD_MISMATCH', 400);
    }

    // Validate password strength (minimum 8 characters, at least one uppercase, one lowercase, one number)
    const passwordRegex = /^.{8,}$/;

    if (!passwordRegex.test(request.newPassword)) {
      throw new AppError('Password must be at least 8 characters long', 'INVALID_PASSWORD', 400);
    }
  }
}