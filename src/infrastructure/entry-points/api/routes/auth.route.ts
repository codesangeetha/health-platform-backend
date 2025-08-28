import { Router } from 'express';
import { IRegisterUserController } from '@/application/controllers/interfaces/authentication/register-user.controller.interface';
import { ILoginUserController } from '@/application/controllers/interfaces/authentication/login-user.controller.interface';
import { IForgotPasswordController } from '@/application/controllers/interfaces/authentication/forgot-password.controller.interface';
import { IResetPasswordController } from '@/application/controllers/interfaces/authentication/reset-password.controller.interface';

export class AuthRoute {
    public readonly router: Router;
    private readonly registerUserController: IRegisterUserController;
    private readonly loginUserController: ILoginUserController;
    private readonly forgotPasswordController: IForgotPasswordController;
    private readonly resetPasswordController: IResetPasswordController;


    constructor(registerUserController: IRegisterUserController, loginUserController: ILoginUserController, forgotPasswordController: IForgotPasswordController, resetPasswordController: IResetPasswordController) {


        this.router = Router();
        this.registerUserController = registerUserController;
        this.loginUserController = loginUserController;
        this.forgotPasswordController = forgotPasswordController;
        this.resetPasswordController = resetPasswordController;
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post('/auth/register', this.registerUserController.registerUser.bind(this.registerUserController));
        this.router.post('/auth/login', this.loginUserController.loginUser.bind(this.loginUserController));
        this.router.post('/auth/forgot-password', this.forgotPasswordController.forgotPassword.bind(this.forgotPasswordController));
        this.router.post('/auth/reset-password', this.resetPasswordController.resetPassword.bind(this.resetPasswordController));
    }
}