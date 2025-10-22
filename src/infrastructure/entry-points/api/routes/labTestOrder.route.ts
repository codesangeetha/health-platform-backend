import { Router } from 'express';
import { authenticateToken } from '@/application/middlewares/auth.middleware';
import { OrderLabTestController } from '@/application/controllers/labTestOrder/order-lab-test.controller';
import { GetLabTestOrdersController } from '@/application/controllers/labTestOrder/get-lab-test-orders.controller';

export class LabTestOrderRoute {
    public router: Router;

    constructor(
        private readonly orderLabTestController: OrderLabTestController,
        private readonly getLabTestOrdersController: GetLabTestOrdersController
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Order lab tests route
        this.router.post('/lab-tests/orders', authenticateToken, (req, res) => this.orderLabTestController.handle(req, res));

        // Get lab test orders route with filtering and pagination
        this.router.get('/lab-tests/orders', authenticateToken, (req, res) => this.getLabTestOrdersController.handle(req, res));
    }
}