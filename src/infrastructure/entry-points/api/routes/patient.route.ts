import { Router } from 'express';
import { GetPatientProfileController } from '@/application/controllers/patient/get-patient-profile.controller';
import { authenticateToken } from '@/application/middlewares/auth.middleware';
import { UpdatePatientProfileController } from '@/application/controllers/patient/update-patient-profile.controller';
import { GetPatientDashboardCountsController } from '@/application/controllers/patient/get-patient-dashboard-counts.controller';

export class PatientRoute {
  public router: Router;
  private getPatientProfileController: GetPatientProfileController;
  private updatePatientProfileController: UpdatePatientProfileController;
  private getPatientDashboardCountsController: GetPatientDashboardCountsController;

  constructor(
    getPatientProfileController: GetPatientProfileController,
    updatePatientProfileController: UpdatePatientProfileController,
    getPatientDashboardCountsController: GetPatientDashboardCountsController
  ) {
    this.router = Router();
    this.getPatientProfileController = getPatientProfileController;
    this.updatePatientProfileController = updatePatientProfileController;
    this.getPatientDashboardCountsController = getPatientDashboardCountsController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/patients/profile', authenticateToken, (req, res) => this.getPatientProfileController.handle(req, res)
    );
    this.router.put('/patients/profile', authenticateToken, (req, res) => this.updatePatientProfileController.handle(req, res)
    );
    this.router.get('/patients/dashboard', authenticateToken, (req, res) => this.getPatientDashboardCountsController.handle(req, res)
    );
  }
}