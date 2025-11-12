import { Router } from 'express';
import { authenticateToken } from '@/application/middlewares/auth.middleware';
import { GetDoctorProfileController } from '@/application/controllers/doctor/get-doctor-profile.controller';
import { UpdateDoctorProfileController } from '@/application/controllers/doctor/update-doctor-profile.controller';
import { EditDoctorProfileController } from '@/application/controllers/doctor/edit-doctor-profile.controller';
import { DeleteDoctorController } from '@/application/controllers/doctor/delete-doctor.controller';
import { GetDoctorDashboardCountsController } from '@/application/controllers/doctor/get-doctor-dashboard-counts.controller';

export class DoctorRoute {
    public router: Router;
    private getDoctorProfileController: GetDoctorProfileController;
    private updateDoctorProfileController: UpdateDoctorProfileController;
    private editDoctorProfileController: EditDoctorProfileController;
    private deleteDoctorController: DeleteDoctorController;
    private getDoctorDashboardCountsController: GetDoctorDashboardCountsController;

    constructor(
        getDoctorProfileController: GetDoctorProfileController,
        updateDoctorProfileController: UpdateDoctorProfileController,
        editDoctorProfileController: EditDoctorProfileController,
        deleteDoctorController: DeleteDoctorController,
        getDoctorDashboardCountsController: GetDoctorDashboardCountsController
    ) {
        this.router = Router();
        this.getDoctorProfileController = getDoctorProfileController;
        this.updateDoctorProfileController = updateDoctorProfileController;
        this.editDoctorProfileController = editDoctorProfileController;
        this.deleteDoctorController = deleteDoctorController;
        this.getDoctorDashboardCountsController = getDoctorDashboardCountsController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/doctors/profile', authenticateToken, (req, res) => this.getDoctorProfileController.handle(req, res)
        );
        this.router.put('/doctors/profile', authenticateToken, (req, res) => this.updateDoctorProfileController.handle(req, res)
        );
        this.router.put('/doctors/:id', authenticateToken, (req, res) => this.editDoctorProfileController.handle(req, res)
);
        this.router.delete('/doctors/:id', authenticateToken, (req, res) => this.deleteDoctorController.handle(req, res)
        );
        this.router.get('/doctors/dashboard', authenticateToken, (req, res) => this.getDoctorDashboardCountsController.handle(req, res)
        );
    }
}