import { ILoginUserUseCase } from '../interfaces/authentication/login-user.use-case.interface';
import { IUserRepository } from '../interfaces/authentication/user-repository.interface';
import { IJwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service.interface';
import { UserLoginRequest, UserLoginResponse } from '@/domain/types/authentication/user-login.type';
import { AppError } from '@/shared/errors/app-error';
import { validatePassword } from '@/shared/utils/helpers';
import { hashPassword } from '@/shared/utils/helpers';

export class LoginUserUseCase implements ILoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService
  ) { }

  async execute(request: UserLoginRequest): Promise<UserLoginResponse> {
    // Validate input
    this.validateLoginRequest(request);

    // Handle hardcoded admin users
    if (request.email === "admin@mail.com" && request.password === "adminpwd") {
      const tokenPayload = {
        userId: "adminid",
        email: request.email,
        userType: "admin",
        firstName: "Admin",
        lastName: "User"
      };

      const token = await this.jwtService.signToken(tokenPayload);
      return {
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: tokenPayload as any
        }
      };
    }

    // Handle pharmacy admin user
    if (request.email === "pharmadmin@mail.com" && request.password === "pharmadminpwd") {
      const tokenPayload = {
        userId: "pharmadminid",
        email: request.email,
        userType: "pharmadmin",
        firstName: "Pharmacy",
        lastName: "Admin"
      };

      const token = await this.jwtService.signToken(tokenPayload);
      return {
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: tokenPayload as any
        }
      };
    }

    // Handle lab test admin user
    if (request.email === "labadmin@mail.com" && request.password === "labadminpwd") {
      const tokenPayload = {
        userId: "labadminid",
        email: request.email,
        userType: "labadmin",
        firstName: "Lab Test",
        lastName: "Admin"
      };

      const token = await this.jwtService.signToken(tokenPayload);
      return {
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: tokenPayload as any
        }
      };
    }

    // Find user by email
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new AppError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }

    // Check if doctor is active (do not allow inactive doctors to login)
    if (user.userType === 'doctor' && !user.isActive) {
      throw new AppError('Account is inactive. Please contact support.', 'ACCOUNT_INACTIVE', 403);
    }

    // Check if doctor has set password (doctors may not have set password initially)
    if (user.userType === 'doctor' && !user.password) {
      throw new AppError('Password not set. Please use the password reset link sent to your email to set your password.', 'PASSWORD_NOT_SET', 403);
    }

    // Verify password
    const isPasswordValid = await validatePassword(request.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }

    // Generate JWT token
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName
    };

    const token = await this.jwtService.signToken(tokenPayload);

    // Return response
    return {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          userId: user._id,
          email: user.email,
          userType: user.userType,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    };
  }

  private validateLoginRequest(request: UserLoginRequest): void {
    if (!request.email || !request.password) {
      throw new AppError('Email and password are required', 'MISSING_CREDENTIALS', 400);
    }

    if (!request.email.includes('@')) {
      throw new AppError('Invalid email format', 'INVALID_EMAIL', 400);
    }
  }
}