import { Request, Response } from 'express';
import { IInstagramOAuthController } from '@/application/controllers/interfaces/authentication/instagram-oauth.controller.interface';
import { IInstagramOAuthUseCase } from '@/domain/use-cases/interfaces/authentication/instagram-oauth.use-case.interface';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';

export class InstagramOAuthController implements IInstagramOAuthController {
  constructor(
    private readonly instagramOAuthUseCase: IInstagramOAuthUseCase,
    private readonly jwtService: JwtService
  ) {}

  async instagramAuth(req: Request, res: Response): Promise<void> {
    try {
      console.log('📸 Instagram OAuth initiated from IP:', req.ip);
      console.log('🔄 Redirecting to Instagram for authentication...');

      // Instagram OAuth parameters
      const clientId = process.env.INSTAGRAM_APP_ID;
      const redirectUri = process.env.INSTAGRAM_CALLBACK_URL;
      
      if (!clientId || !redirectUri) {
        console.error('❌ Instagram configuration missing:', { clientId: !!clientId, redirectUri: !!redirectUri });
        res.status(500).json({
          success: false,
          message: 'Instagram OAuth configuration error',
          error: 'Missing Instagram app credentials'
        });
        return;
      }

      // Instagram authorization URL with required parameters
      const authUrl = new URL('https://www.instagram.com/oauth/authorize');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('scope', 'instagram_business_basic');
      authUrl.searchParams.set('response_type', 'code');

      console.log('📸 Instagram OAuth URL:', authUrl.toString());

      // Redirect to Instagram authorization page
      res.redirect(authUrl.toString());
    } catch (error) {
      console.error('❌ Instagram OAuth initiation error:', error);
      res.status(500).json({
        success: false,
        message: 'Authentication error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async instagramAuthCallback(req: Request, res: Response): Promise<void> {
    try {
      console.log('📸 Instagram OAuth callback received');
      console.log('📋 Query parameters:', req.query);
      console.log('🔗 Request URL:', req.url);

      const { code } = req.query;

      if (!code) {
        console.error('❌ No authorization code received from Instagram');
        return res.redirect(
          `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/instagram/callback?success=false&error=No authorization code received`
        );
      }

      console.log('🔑 Authorization code received:', code);

      // Process Instagram OAuth callback
      const user = await this.instagramOAuthUseCase.authenticateWithInstagram(code as string);

      console.log('✅ Instagram OAuth successful for user:', user.email);
      console.log('👤 User details:', {
        id: user.id,
        email: user.email,
        userType: user.userType,
        isActive: user.isActive
      });

      // Generate JWT token
      console.log('🔐 Generating JWT token...');
      const token = await this.jwtService.signToken({
        userId: user.id,
        email: user.email,
        userType: user.userType,
        firstName: user.firstName,
        lastName: user.lastName
      });
      console.log('✅ JWT token generated successfully');
      console.log('📏 Token length:', token.length);

      // Redirect to frontend Instagram callback handler with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectUrl = `${frontendUrl}/auth/instagram/callback?token=${token}&success=true`;
      console.log('🔄 Redirecting to frontend:', redirectUrl);

      res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ Unexpected error in Instagram OAuth callback:', error);
      
      // Handle specific Instagram OAuth errors
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.message.includes('invalid_grant')) {
          errorMessage = 'Authorization code expired or invalid';
        } else if (error.message.includes('invalid_client')) {
          errorMessage = 'Invalid Instagram app credentials';
        } else {
          errorMessage = error.message;
        }
      }

      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/instagram/callback?success=false&error=${encodeURIComponent(errorMessage)}`
      );
    }
  }
}