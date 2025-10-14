import { AppError } from '@/shared/errors/app-error';
import { IGetAppointmentDetailsUseCase } from '../interfaces/appointments/get-appointment-details.use-case.interface';
import { IAppointmentRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository.interface';
import { IPatientRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient-repository.interface';
import { IDoctorRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository.interface';
import { GetAppointmentDetailsRequest, GetAppointmentDetailsResponse } from '@/domain/types/appointments/get-appointment-details.type';

export class GetAppointmentDetailsUseCase implements IGetAppointmentDetailsUseCase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly patientRepository: IPatientRepository,
        private readonly doctorRepository: IDoctorRepository
    ) { }

    async execute(request: GetAppointmentDetailsRequest): Promise<GetAppointmentDetailsResponse> {
        // Validate input
        this.validateRequest(request);

        // Find appointment by ID
        const appointment = await this.appointmentRepository.findById(request.appointmentId);

        if (!appointment) {
            throw new AppError('Appointment not found', 'APPOINTMENT_NOT_FOUND', 404);
        }

        // Fetch patient details
        const patient = await this.patientRepository.findById(appointment.patientId);
        if (!patient) {
            throw new AppError('Patient not found', 'PATIENT_NOT_FOUND', 404);
        }

        // Fetch doctor details
        const doctor = await this.doctorRepository.findById(appointment.doctorId);
        if (!doctor) {
            throw new AppError('Doctor not found', 'DOCTOR_NOT_FOUND', 404);
        }

        // Calculate patient age
        const today = new Date();
        const birthDate = new Date(patient.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Return response
        return {
            success: true,
            message: 'Appointment details retrieved successfully',
            data: {
                appointmentId: appointment.id,
                patientId: appointment.patientId,
                doctorId: appointment.doctorId,
                patientName: `${patient.firstName} ${patient.lastName}`,
                doctorName: `${doctor.firstName} ${doctor.lastName}`,
                patientAge: age,
                date: (appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]) as string,
                time: appointment.time,
                isVideoCall: appointment.isVideoCall,
                status: appointment.status,
                reason: appointment.reason,
                createdAt: appointment.createdAt.toISOString(),
                updatedAt: appointment.updatedAt.toISOString()
            },
            timestamp: new Date().toISOString()
        };
    }

    private validateRequest(request: GetAppointmentDetailsRequest): void {
        if (!request.appointmentId || request.appointmentId.trim() === '') {
            throw new AppError('Appointment ID is required', 'INVALID_INPUT', 400);
        }
    }
}