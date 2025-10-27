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
        console.log('=== BOOK APPOINTMENT START ===');
        console.log('Patient ID:', patientId);
        console.log('Request data:', JSON.stringify(request, null, 2));

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

        console.log('Appointment data to be saved:', JSON.stringify(appointmentData, null, 2));

        try {
            savedAppointment = await this.appointmentRepository.create(appointmentData);
            console.log('Appointment saved successfully:', savedAppointment.id);
        } catch (error) {
            console.error('Error in use case:', error);
            throw error;
        }

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
        const commonFields = ['doctorId', 'date', 'time', 'reason', 'symptoms'];
        for (const field of commonFields) {
            if (!request[field as keyof typeof request]) {
                throw new AppError(`Missing required field: ${field}`, 'USER_001', 400);
            }
        }
        
        // Special validation for isVideoCall - it should be explicitly true or false
        if (typeof request.isVideoCall !== 'boolean') {
            throw new AppError('isVideoCall must be a boolean value', 'USER_001', 400);
        }
    }
}