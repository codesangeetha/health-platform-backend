import { Router } from 'express';
import passport from 'passport';
import { authenticateToken } from '@/application/middlewares/auth.middleware';
import { IRegisterUserController } from '@/application/controllers/interfaces/authentication/register-user.controller.interface';
import { ILoginUserController } from '@/application/controllers/interfaces/authentication/login-user.controller.interface';
import { IForgotPasswordController } from '@/application/controllers/interfaces/authentication/forgot-password.controller.interface';
import { IResetPasswordController } from '@/application/controllers/interfaces/authentication/reset-password.controller.interface';
import { IGoogleOAuthController } from '@/application/controllers/interfaces/authentication/google-oauth.controller.interface';

export class AuthRoute {
     public readonly router: Router;
     private readonly registerUserController: IRegisterUserController;
     private readonly loginUserController: ILoginUserController;
     private readonly forgotPasswordController: IForgotPasswordController;
     private readonly resetPasswordController: IResetPasswordController;
     private readonly googleOAuthController: IGoogleOAuthController;


     constructor(
          registerUserController: IRegisterUserController,
          loginUserController: ILoginUserController,
          forgotPasswordController: IForgotPasswordController,
          resetPasswordController: IResetPasswordController,
          googleOAuthController: IGoogleOAuthController
     ) {


         this.router = Router();
         this.registerUserController = registerUserController;
         this.loginUserController = loginUserController;
         this.forgotPasswordController = forgotPasswordController;
         this.resetPasswordController = resetPasswordController;
         this.googleOAuthController = googleOAuthController;
         this.setupRoutes();
     }

     private setupRoutes(): void {
         this.router.post('/auth/register', this.registerUserController.registerUser.bind(this.registerUserController));
         this.router.post('/auth/login', this.loginUserController.loginUser.bind(this.loginUserController));
         this.router.post('/auth/forgot-password', this.forgotPasswordController.forgotPassword.bind(this.forgotPasswordController));
         this.router.post('/auth/reset-password', this.resetPasswordController.resetPassword.bind(this.resetPasswordController));

         // Google OAuth routes
         this.router.get('/auth/google', this.googleOAuthController.googleAuth.bind(this.googleOAuthController));
         this.router.get('/auth/google/callback', this.googleOAuthController.googleAuthCallback.bind(this.googleOAuthController));
         this.router.get('/auth/me', authenticateToken, this.googleOAuthController.getCurrentUser.bind(this.googleOAuthController));
         this.router.post('/auth/logout', this.googleOAuthController.logout.bind(this.googleOAuthController));
         // Enhanced logout endpoint for Google OAuth (forces account selection on next login)
         this.router.post('/auth/google-logout', this.googleOAuthController.googleLogout.bind(this.googleOAuthController));
     }
 }