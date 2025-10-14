import { Request, Response } from 'express';
import passport from 'passport';
import { IGoogleOAuthController } from '@/application/controllers/interfaces/authentication/google-oauth.controller.interface';
import { IGoogleOAuthUseCase } from '@/domain/use-cases/interfaces/authentication/google-oauth.use-case.interface';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';

export class GoogleOAuthController implements IGoogleOAuthController {
  constructor(
    private readonly googleOAuthUseCase: IGoogleOAuthUseCase,
    private readonly jwtService: JwtService
  ) {}

  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔐 Google OAuth initiated from IP:', req.ip);
      console.log('🌐 Redirecting to Google for authentication...');

      // Force account selection and proper OAuth flow
      const authOptions = {
        scope: ['profile', 'email'],
        session: true,
        prompt: 'select_account', // Force Google to show account chooser
        access_type: 'offline',   // Request refresh token
        include_granted_scopes: true // Include previously granted scopes
      };

      console.log('🔧 Google OAuth options:', JSON.stringify(authOptions, null, 2));

      // Trigger Google OAuth authentication
      // This will redirect to Google
      passport.authenticate('google', authOptions)(req, res);
    } catch (error) {
      console.error('❌ Google OAuth initiation error:', error);
      res.status(500).json({
        success: false,
        message: 'Authentication error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async googleAuthCallback(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔄 Google OAuth callback received');
      console.log('📋 Query parameters:', req.query);
      console.log('📋 Request URL:', req.url);

      // Use Passport to authenticate the callback
      passport.authenticate('google', async (err: any, user: any, info: any) => {
        console.log('🔍 Passport authentication result:', { err: !!err, user: !!user, info });

        if (err) {
          console.error('❌ Google OAuth authentication error:', err.message);
          return res.redirect(
            `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/callback?success=false&error=${encodeURIComponent(err.message)}`
          );
        }

        if (!user) {
          console.error('❌ Google OAuth failed: No user returned');
          console.error('❌ Passport info:', info);
          return res.redirect(
            `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/callback?success=false&error=Authentication failed`
          );
        }

        console.log('✅ Google OAuth successful for user:', user.email);
        console.log('👤 User details:', {
          id: user._id || user.id,
          email: user.email,
          userType: user.userType,
          isVerified: user.isVerified,
          googleId: user.googleId
        });

        // Generate JWT token
        console.log('🔑 Generating JWT token...');
        const token = await this.jwtService.signToken({
          id: user._id || user.id,
          email: user.email,
          userType: user.userType || 'patient',
        });
        console.log('✅ JWT token generated successfully');
        console.log('🔑 Token length:', token.length);

        // Redirect to frontend Google callback handler with token
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const redirectUrl = `${frontendUrl}/auth/google/callback?token=${token}&success=true`;
        console.log('🔀 Redirecting to frontend:', redirectUrl);

        res.redirect(redirectUrl);
      })(req, res);
    } catch (error) {
      console.error('💥 Unexpected error in Google OAuth callback:', error);
      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/callback?success=false&error=${
          error instanceof Error ? encodeURIComponent(error.message) : 'Unknown error'
        }`
      );
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      console.log('👤 Getting current user info');
      const user = req.user as any;

      if (!user) {
        console.log('❌ No authenticated user found');
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      console.log('✅ User authenticated:', user.email);
      res.json({
        success: true,
        user: {
          id: user._id || user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          isVerified: user.isVerified,
          userType: user.userType || 'patient',
        },
      });
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user data',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Enhanced logout method that properly handles Google OAuth logout
   * This method clears all authentication data and forces account selection on next login
   */
  async googleLogout(req: Request, res: Response): Promise<void> {
    try {
      console.log('🚪 Google OAuth logout requested - forcing account selection on next login');

      // Clear our application cookies
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Clear Google OAuth state
      res.clearCookie('google_oauth_state', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Clear session
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            console.error('❌ Error destroying session:', err);
          }
        });
      }

      // Return success response with additional logout information
      const responseData = {
        success: true,
        message: 'Logged out successfully',
        actions: [
          'Application cookies cleared',
          'Google OAuth state cleared',
          'Session destroyed',
          'Account selection forced on next login'
        ]
      };

      console.log('✅ Google OAuth logout successful');
      console.log('📤 Response:', JSON.stringify(responseData, null, 2));

      res.json(responseData);
    } catch (error) {
      console.error('❌ Google OAuth logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      // Detailed request logging
      console.log('🚪 Logout requested');
      console.log('📋 Request details:');
      console.log('  - Method:', req.method);
      console.log('  - URL:', req.url);
      console.log('  - Origin:', req.get('Origin'));
      console.log('  - User-Agent:', req.get('User-Agent'));
      console.log('  - IP:', req.ip);
      console.log('  - Headers:', JSON.stringify(req.headers, null, 2));
      console.log('  - Cookies:', req.headers.cookie ? 'Present' : 'None');
      console.log('  - Session ID:', req.sessionID || 'No session');

      if (req.user) {
        console.log('  - User:', {
          id: (req.user as any)._id || (req.user as any).id,
          email: (req.user as any).email,
          userType: (req.user as any).userType
        });
      } else {
        console.log('  - User: Not authenticated');
      }

      // Clear any authentication cookies if they exist
      console.log('🧹 Clearing authentication cookies...');
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Clear Google OAuth specific cookies that might be causing auto-login
      console.log('🧹 Clearing Google OAuth cookies...');
      res.clearCookie('google_oauth_state', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Clear any Google-related cookies that might interfere
      const googleCookies = ['G_AUTHUSER_H', 'G_ENABLED_IDPS', 'G_AUTHUSER_0', 'GoogleAccountsLocale_session'];
      googleCookies.forEach(cookieName => {
        res.clearCookie(cookieName, {
          domain: '.google.com',
          path: '/',
          secure: true,
          sameSite: 'none'
        });
      });

      // Clear session if using sessions
      if (req.session) {
        console.log('🧹 Destroying session:', req.sessionID);
        req.session.destroy((err) => {
          if (err) {
            console.error('❌ Error destroying session:', err);
          } else {
            console.log('✅ Session destroyed successfully');
          }
        });
      } else {
        console.log('ℹ️ No session to destroy');
      }

      // For JWT-based logout, the main work is done client-side
      // Server just needs to clear any server-side session data
      console.log('✅ Logout successful');

      // Detailed response logging
      const responseData = {
        success: true,
        message: 'Logged out successfully',
      };

      console.log('📤 Response details:');
      console.log('  - Status Code: 200');
      console.log('  - Response Data:', JSON.stringify(responseData, null, 2));
      console.log('  - Cookies cleared: token, google_oauth_state, Google OAuth cookies');
      console.log('  - Session destroyed:', req.session ? 'Yes' : 'No');
      console.log('  - CORS headers will be added by middleware');

      res.json(responseData);
    } catch (error) {
      console.error('❌ Logout error:');
      console.error('  - Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('  - Error message:', error instanceof Error ? error.message : String(error));
      console.error('  - Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');

      const errorResponse = {
        success: false,
        message: 'Logout error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      console.log('📤 Error response:', JSON.stringify(errorResponse, null, 2));

      res.status(500).json(errorResponse);
    }
  }
}