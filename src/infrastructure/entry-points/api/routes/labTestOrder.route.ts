import { Router } from 'express';
import { authenticateToken } from '@/application/middlewares/auth.middleware';
import { OrderLabTestController } from '@/application/controllers/labTestOrder/order-lab-test.controller';
import { GetLabTestOrdersController } from '@/application/controllers/labTestOrder/get-lab-test-orders.controller';
import { GetLabTestOrderByIdController } from '@/application/controllers/labTestOrder/get-lab-test-order-by-id.controller';
import { UpdateLabTestOrderStatusController } from '@/application/controllers/labTestAdmin/update-order-status.controller';

export class LabTestOrderRoute {
    public router: Router;

    constructor(
        private readonly orderLabTestController: OrderLabTestController,
        private readonly getLabTestOrdersController: GetLabTestOrdersController,
        private readonly getLabTestOrderByIdController: GetLabTestOrderByIdController,
        private readonly updateLabTestOrderStatusController: UpdateLabTestOrderStatusController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Order lab tests route
        this.router.post('/lab-tests/orders', authenticateToken, (req, res) => this.orderLabTestController.handle(req, res));

        // Get lab test orders route with filtering and pagination
        this.router.get('/lab-tests/orders', authenticateToken, (req, res) => this.getLabTestOrdersController.handle(req, res));

        // Get lab test order by ID route
        this.router.get('/lab-test-orders/:orderId', authenticateToken, (req, res) => this.getLabTestOrderByIdController.handle(req, res));

        // Update lab test order status route
        this.router.put('/lab-test-orders/:orderId/status', authenticateToken, (req, res) => this.updateLabTestOrderStatusController.handle(req, res));
    }
}