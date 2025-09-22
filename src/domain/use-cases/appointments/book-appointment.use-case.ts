import { AppError } from '@/shared/errors/app-error';
import { IBookAppointmentUseCase } from '../interfaces/appointments/book-appointment.use-case.interface';
import { IAppointmentRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository.interface';
import { BookAppointmentRequest, BookAppointmentResponse } from '@/domain/types/appointments/book-appointment.type';
import { Appointment } from '@/domain/entities/appointment.entity';

export class BookAppointmentUseCase implements IBookAppointmentUseCase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(request: BookAppointmentRequest, patientId: string): Promise<BookAppointmentResponse> {
        // Validate input
        this.validateRegistrationRequest(request);

        let savedAppointment;

        const appointmentData = {
            patientId: patientId,
            doctorId: request.doctorId,
            date: request.date,
            time: request.time,
            isVideoCall: request.isVideoCall,
            reason: request.reason,
            symptoms: request.symptoms
        };
        savedAppointment = await this.appointmentRepository.create(appointmentData);

        return {
            success: true,
            message: 'Appointment created successfully',
            timestamp: new Date().toISOString(),
            data: {
                appointmentId: savedAppointment.id,
                doctorId: savedAppointment.doctorId,
                patientId: savedAppointment.patientId,
                date: savedAppointment.date.toISOString(),
                time: savedAppointment.time,
                status: savedAppointment.status,
                isVideoCall: savedAppointment.isVideoCall
            }
        };
    }

    private validateRegistrationRequest(request: BookAppointmentRequest): void {
        const commonFields = ['doctorId', 'date', 'time', 'isVideoCall', 'reason', 'symptoms'];
        for (const field of commonFields) {
            if (!request[field as keyof typeof request]) {
                throw new AppError(`Missing required field: ${field}`, 'USER_001', 400);
            }
        }

    }
}