import { IJwtService } from './jwt.service.interface';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { AppError } from '@/shared/errors/app-error';

export class JwtService implements IJwtService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string
  ) {}

  async signToken(payload: any): Promise<string> {
    try {
      const signOptions: SignOptions = {
        expiresIn: this.expiresIn as any,
        algorithm: 'HS256',
      };

      // Explicit type casting to resolve TypeScript error
      return jwt.sign(payload, this.secret as jwt.Secret, signOptions);
    } catch (error) {
      throw new AppError('Failed to sign token', 'JWT_SIGN_ERROR', 500);
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const verifyOptions: VerifyOptions = {
        algorithms: ['HS256'],
      };

      return jwt.verify(token, this.secret as jwt.Secret, verifyOptions);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token', 'JWT_INVALID_TOKEN', 401);
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expired', 'JWT_TOKEN_EXPIRED', 401);
      }
      throw new AppError('Failed to verify token', 'JWT_VERIFY_ERROR', 500);
    }
  }
}