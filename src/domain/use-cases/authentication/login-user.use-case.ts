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
  ) {}

  async execute(request: UserLoginRequest): Promise<UserLoginResponse> {
    // Validate input
    this.validateLoginRequest(request);
console.log("validateLoginRequest");
    // Find user by email
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new AppError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }
console.log("find user by mail");

const hashedPassword = await hashPassword(request.password);
    // Verify password
    const isPasswordValid = await validatePassword(request.password, user.password);
    console.log("req.pwd",hashedPassword);
    console.log("user.pwd",user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 'INVALID_CREDENTIALS', 401);
    }
console.log("find user by pwd");

    // Generate JWT token
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      userType: user.userType
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
          userType: user.userType
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