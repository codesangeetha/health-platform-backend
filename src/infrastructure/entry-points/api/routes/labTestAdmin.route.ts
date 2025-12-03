import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '@/application/middlewares/auth.middleware';
import { CreateLabTestCategoryController } from '@/application/controllers/labTestAdmin/create-lab-test-category.controller';
import { GetLabTestCategoriesController } from '@/application/controllers/labTestAdmin/get-lab-test-categories.controller';
import { GetLabTestCategoryController } from '@/application/controllers/labTestAdmin/get-lab-test-category.controller';
import { UpdateLabTestCategoryController } from '@/application/controllers/labTestAdmin/update-lab-test-category.controller';
import { DeleteLabTestCategoryController } from '@/application/controllers/labTestAdmin/delete-lab-test-category.controller';
import { CreateLabTestController } from '@/application/controllers/labTestAdmin/create-lab-test.controller';
import { GetLabTestsController } from '@/application/controllers/labTestAdmin/get-lab-tests.controller';
import { GetLabTestController } from '@/application/controllers/labTestAdmin/get-lab-test.controller';
import { UpdateLabTestController } from '@/application/controllers/labTestAdmin/update-lab-test.controller';
import { DeleteLabTestController } from '@/application/controllers/labTestAdmin/delete-lab-test.controller';
import { UpdateLabTestOrderStatusController } from '@/application/controllers/labTestAdmin/update-order-status.controller';
import { GetLabTestDashboardCountsController } from '@/application/controllers/labTestAdmin/get-lab-test-dashboard-counts.controller';

export class LabTestAdminRoute {
    public router: Router;

    constructor(
        private readonly createLabTestCategoryController: CreateLabTestCategoryController,
        private readonly getLabTestCategoriesController: GetLabTestCategoriesController,
        private readonly getLabTestCategoryController: GetLabTestCategoryController,
        private readonly updateLabTestCategoryController: UpdateLabTestCategoryController,
        private readonly deleteLabTestCategoryController: DeleteLabTestCategoryController,
        private readonly createLabTestController: CreateLabTestController,
        private readonly getLabTestsController: GetLabTestsController,
        private readonly getLabTestController: GetLabTestController,
        private readonly updateLabTestController: UpdateLabTestController,
        private readonly deleteLabTestController: DeleteLabTestController,
        private readonly updateLabTestOrderStatusController: UpdateLabTestOrderStatusController,
        private readonly getLabTestDashboardCountsController: GetLabTestDashboardCountsController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Lab Test Category routes
        this.router.post('/lab-test-categories', authenticateToken, authorizeRoles(['admin']), (req, res) => this.createLabTestCategoryController.handle(req, res));
        this.router.get('/lab-test-categories', authenticateToken, authorizeRoles(['patient', 'doctor', 'admin', 'labadmin']), (req, res) => this.getLabTestCategoriesController.handle(req, res));
        this.router.get('/lab-test-categories/:id', authenticateToken, authorizeRoles(['patient', 'doctor', 'admin', 'labadmin']), (req, res) => this.getLabTestCategoryController.handle(req, res));
        this.router.put('/lab-test-categories/:id', authenticateToken, authorizeRoles(['admin']), (req, res) => this.updateLabTestCategoryController.handle(req, res));
        this.router.delete('/lab-test-categories/:id', authenticateToken, authorizeRoles(['admin']), (req, res) => this.deleteLabTestCategoryController.handle(req, res));

        // Lab Test routes
        this.router.post('/lab-tests', authenticateToken, authorizeRoles(['admin']), (req, res) => this.createLabTestController.handle(req, res));
        this.router.get('/lab-tests', authenticateToken, authorizeRoles(['patient', 'doctor', 'admin', 'labadmin']), (req, res) => this.getLabTestsController.handle(req, res));
        this.router.get('/lab-tests/:id', authenticateToken, authorizeRoles(['patient', 'doctor', 'admin', 'labadmin']), (req, res) => this.getLabTestController.handle(req, res));
        this.router.put('/lab-tests/:id', authenticateToken, authorizeRoles(['admin']), (req, res) => this.updateLabTestController.handle(req, res));
        this.router.delete('/lab-tests/:id', authenticateToken, authorizeRoles(['admin']), (req, res) => this.deleteLabTestController.handle(req, res));

        // Lab Test Order routes
        this.router.put('/lab-test-orders/:orderId/status', authenticateToken, authorizeRoles(['admin', 'labadmin']), (req, res) => this.updateLabTestOrderStatusController.handle(req, res));

        // Lab Test dashboard counts route (Lab Test Admin only)
        this.router.get('/lab-test/dashboard/counts', authenticateToken, authorizeRoles(['admin', 'labadmin']), (req, res) =>
            this.getLabTestDashboardCountsController.handle(req, res)
        );
    }
}