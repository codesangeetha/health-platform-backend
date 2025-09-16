import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';
import { AppError } from '@/shared/errors/app-error';
import { request } from 'http';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        console.log('token err ');
        const err = new AppError('Access token required', 'UNAUTHORIZED', 401);
        return next(err);
    }

    const jwtService = new JwtService(
        process.env.JWT_SECRET || 'default-secret',
        process.env.JWT_EXPIRES_IN || '24h'
    );

    // Verify JWT token
    let decodedToken: any;
    try {

        decodedToken = await jwtService.verifyToken(token);
        (req as any).user = decodedToken;

        next()
    } catch (error) {
        const err = new AppError('Invalid or expired reset token', 'INVALID_TOKEN', 401);
        return next(err);
    }
};