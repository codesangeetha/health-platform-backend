import { Router } from 'express';
import { GetAllUsersController } from '@/application/controllers/admin/get-all-users.controller';
import { CreateUserController } from '@/application/controllers/admin/create-user.controller';
import { UpdateUserStatusController } from '@/application/controllers/admin/update-user-status.controller';
import { GetDashboardCountsController } from '@/application/controllers/admin/get-dashboard-counts.controller';
import { EditPatientByAdminController } from '@/application/controllers/admin/edit-patient-by-admin.controller';
import { DeletePatientByAdminController } from '@/application/controllers/admin/delete-patient-by-admin.controller';
import { SpecializationController } from '@/application/controllers/admin/specialization.controller';
import { authenticateToken } from '@/application/middlewares/auth.middleware';


export class AdminRoute {
    public router: Router;

    constructor(
        private readonly getAllUsersController: GetAllUsersController,
        private readonly createUserController: CreateUserController,
        private readonly updateUserStatusController: UpdateUserStatusController,
        private readonly getDashboardCountsController: GetDashboardCountsController,
        private readonly editPatientByAdminController: EditPatientByAdminController,
        private readonly deletePatientByAdminController: DeletePatientByAdminController,
        private readonly specializationController: SpecializationController
    ) {
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

        this.router.put('/admin/patients/:id', authenticateToken, (req, res) => this.editPatientByAdminController.handle(req, res)
        );

        this.router.delete('/admin/patients/:id', authenticateToken, (req, res) => this.deletePatientByAdminController.handle(req, res)
        );

        // Specialization routes
        this.router.post('/admin/specializations', authenticateToken, (req, res) => this.specializationController.handleCreate(req, res)
        );

        this.router.get('/admin/specializations', authenticateToken, (req, res) => this.specializationController.handleGetAll(req, res)
        );

        this.router.put('/admin/specializations/:id', authenticateToken, (req, res) => this.specializationController.handleUpdate(req, res)
        );

        this.router.delete('/admin/specializations/:id', authenticateToken, (req, res) => this.specializationController.handleDelete(req, res)
        );
    }
}