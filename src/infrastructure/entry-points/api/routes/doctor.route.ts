import { Router } from 'express';
import { authenticateToken } from '@/application/middlewares/auth.middleware';
import { GetDoctorProfileController } from '@/application/controllers/doctor/get-doctor-profile.controller';
import { UpdateDoctorProfileController } from '@/application/controllers/doctor/update-doctor-profile.controller';


export class DoctorRoute {
    public router: Router;
    private getDoctorProfileController: GetDoctorProfileController;
    private updateDoctorProfileController: UpdateDoctorProfileController;

    constructor(getDoctorProfileController: GetDoctorProfileController, updateDoctorProfileController: UpdateDoctorProfileController) {
        this.router = Router();
        this.getDoctorProfileController = getDoctorProfileController;
        this.updateDoctorProfileController = updateDoctorProfileController;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/doctors/profile', authenticateToken, (req, res) => this.getDoctorProfileController.handle(req, res)
        );
        this.router.put('/doctors/profile', authenticateToken, (req, res) => this.updateDoctorProfileController.handle(req, res)
        );
    }
}