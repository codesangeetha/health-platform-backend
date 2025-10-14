import { Router } from 'express';
import { authenticateToken } from '@/application/middlewares/auth.middleware';
import { CreatePrescriptionController } from '@/application/controllers/prescription/create-prescription.controller';
import { GetPrescriptionController } from '@/application/controllers/prescription/get-prescription.controller';
import { GetPrescriptionByAppointmentController } from '@/application/controllers/prescription/get-prescription-by-appointment.controller';
import { UpdatePrescriptionController } from '@/application/controllers/prescription/update-prescription.controller';
import { DeletePrescriptionController } from '@/application/controllers/prescription/delete-prescription.controller';

export class PrescriptionRoute {
    public router: Router;

    constructor(
        private readonly createPrescriptionController: CreatePrescriptionController,
        private readonly getPrescriptionController: GetPrescriptionController,
        private readonly getPrescriptionByAppointmentController: GetPrescriptionByAppointmentController,
        private readonly updatePrescriptionController: UpdatePrescriptionController,
        private readonly deletePrescriptionController: DeletePrescriptionController
    ) {
        this.router = Router();

        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Create prescription
        this.router.post('/prescriptions', authenticateToken, (req, res) => this.createPrescriptionController.handle(req, res));

        // Get prescription by ID
        this.router.get('/prescriptions/:id', authenticateToken, (req, res) => this.getPrescriptionController.handle(req, res));

        // Get prescription by appointment ID
        this.router.get('/prescriptions/appointment/:appointmentId', authenticateToken, (req, res) => this.getPrescriptionByAppointmentController.handle(req, res));

        // Update prescription
        this.router.put('/prescriptions/:id', authenticateToken, (req, res) => this.updatePrescriptionController.handle(req, res));

        // Delete prescription
        this.router.delete('/prescriptions/:id', authenticateToken, (req, res) => this.deletePrescriptionController.handle(req, res));
    }
}