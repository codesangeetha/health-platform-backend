import { Router } from 'express';
import { authenticateToken } from '@/application/middlewares/auth.middleware';
import { GetDoctorProfileController } from '@/application/controllers/doctor/get-doctor-profile.controller';
import { UpdateDoctorProfileController } from '@/application/controllers/doctor/update-doctor-profile.controller';
import { GetDoctorDashboardCountsController } from '@/application/controllers/doctor/get-doctor-dashboard-counts.controller';

export class DoctorRoute {
    public router: Router;
    private getDoctorProfileController: GetDoctorProfileController;
    private updateDoctorProfileController: UpdateDoctorProfileController;
    private getDoctorDashboardCountsController: GetDoctorDashboardCountsController;

    constructor(
        getDoctorProfileController: GetDoctorProfileController,
        updateDoctorProfileController: UpdateDoctorProfileController,
        getDoctorDashboardCountsController: GetDoctorDashboardCountsController
    ) {
        this.router = Router();
        this.getDoctorProfileController = getDoctorProfileController;
        this.updateDoctorProfileController = updateDoctorProfileController;
        this.getDoctorDashboardCountsController = getDoctorDashboardCountsController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/doctors/profile', authenticateToken, (req, res) => this.getDoctorProfileController.handle(req, res)
        );
        this.router.put('/doctors/profile', authenticateToken, (req, res) => this.updateDoctorProfileController.handle(req, res)
        );
        this.router.get('/doctors/dashboard', authenticateToken, (req, res) => this.getDoctorDashboardCountsController.handle(req, res)
        );
    }
}