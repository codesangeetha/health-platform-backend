import { Router } from 'express';
import { GetAllUsersController } from '@/application/controllers/admin/get-all-users.controller';
import { CreateUserController } from '@/application/controllers/admin/create-user.controller';
import { UpdateUserStatusController } from '@/application/controllers/admin/update-user-status.controller';
import { GetDashboardCountsController } from '@/application/controllers/admin/get-dashboard-counts.controller';
import { authenticateToken } from '@/application/middlewares/auth.middleware';


export class AdminRoute {
    public router: Router;

    constructor(private readonly getAllUsersController: GetAllUsersController, private readonly createUserController: CreateUserController, private readonly updateUserStatusController: UpdateUserStatusController, private readonly getDashboardCountsController: GetDashboardCountsController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/admin/users', authenticateToken, (req, res) => this.getAllUsersController.handle(req, res)
        );

        this.router.post('/admin/users', authenticateToken, (req, res) => this.createUserController.createUser(req, res)
        );

        this.router.put('/admin/users/:userId/status', authenticateToken, (req, res) => this.updateUserStatusController.handle(req, res)
        );

        this.router.get('/admin/dashboard/counts', authenticateToken, (req, res) => this.getDashboardCountsController.handle(req, res)
        );
    }
}