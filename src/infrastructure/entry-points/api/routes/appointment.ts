import { Router } from 'express';
import { authenticateToken } from '@/application/middlewares/auth.middleware';
import { GetAvailableDoctorsController } from '@/application/controllers/appointments/get-available-doctors.controller';
import { BookAppointmentController } from '@/application/controllers/appointments/book-appointment.controller';
import { GetPatientAppointmentsController } from '@/application/controllers/appointments/get-patient-appointments.controller';
import { RescheduleAppointmentController } from '@/application/controllers/appointments/reschedule-appointment.controller';
import { UpdateAppointmentStatusController } from '@/application/controllers/appointments/update-appointment-status.controller';
import { GetDoctorAppointmentsController } from '@/application/controllers/appointments/get-doctor-appointments.controller';

export class AppointmentRoute {
    public router: Router;

    constructor(private readonly getAvailableDoctorsController: GetAvailableDoctorsController,
        private readonly bookAppointmentController: BookAppointmentController,
        private readonly getPatientAppointmentsController: GetPatientAppointmentsController,
        private readonly rescheduleAppointmentController: RescheduleAppointmentController,
        private readonly updateAppointmentStatusController: UpdateAppointmentStatusController,
        private readonly getDoctorAppointmentsController: GetDoctorAppointmentsController
    ) {
        this.router = Router();

        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/appointments/doctors', authenticateToken, (req, res) => this.getAvailableDoctorsController.handle(req, res)
        );

        this.router.post('/appointments/book', authenticateToken, (req, res) => this.bookAppointmentController.handle(req, res)
        );

        this.router.get('/appointments/patient', authenticateToken, (req, res) => this.getPatientAppointmentsController.handle(req, res)
        );

        this.router.get('/appointments/doctor', authenticateToken, (req, res) => this.getDoctorAppointmentsController.handle(req, res)
        );

        this.router.put('/appointments/:appointmentId/reschedule', authenticateToken, (req, res) => this.rescheduleAppointmentController.handle(req, res)
        );

        this.router.put('/appointments/:appointmentId/status', authenticateToken, (req, res) => this.updateAppointmentStatusController.handle(req, res)
        );
    }
}