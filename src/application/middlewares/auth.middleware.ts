import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';
import { AppError } from '@/shared/errors/app-error';
import { jwtConfig } from '@/infrastructure/config/auth/jwt.config';
import { request } from 'http';

type UserType = 'patient' | 'doctor' | 'admin';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
     console.log('🔐 Authenticating token for request:', req.url);
     const authHeader = req.headers['authorization'];
     const token = authHeader && authHeader.split(' ')[1];

     if (!token) {
         console.log('❌ No token provided in Authorization header');
         const err = new AppError('Access token required', 'UNAUTHORIZED', 401);
         return next(err);
     }

     console.log('✅ Token found, verifying...');
     const jwtService = new JwtService(
         jwtConfig.secret,
         jwtConfig.expiresIn
     );

     // Verify JWT token
     let decodedToken: any;
     try {
         decodedToken = await jwtService.verifyToken(token);
         (req as any).user = decodedToken;
         console.log('✅ Token verified successfully for user:', decodedToken.email);
         next();
     } catch (error) {
         console.error('❌ Token verification failed:', error instanceof Error ? error.message : error);
         const err = new AppError('Invalid or expired token', 'INVALID_TOKEN', 401);
         return next(err);
     }
 };

export const authorizeRoles = (allowedRoles: UserType[]) => {
   return (req: Request, res: Response, next: NextFunction) => {
       console.log('🔐 Checking role authorization for request:', req.url);

       const user = (req as any).user;

       if (!user || !user.userType) {
           console.log('❌ No user or userType found in token');
           const err = new AppError('User information missing from token', 'UNAUTHORIZED', 401);
           return next(err);
       }

       if (!allowedRoles.includes(user.userType)) {
           console.log(`❌ User type '${user.userType}' not authorized. Allowed types: ${allowedRoles.join(', ')}`);
           const err = new AppError(`Access denied. Required roles: ${allowedRoles.join(', ')}`, 'FORBIDDEN', 403);
           return next(err);
       }

       console.log(`✅ User type '${user.userType}' authorized for request`);
       next();
   };
};