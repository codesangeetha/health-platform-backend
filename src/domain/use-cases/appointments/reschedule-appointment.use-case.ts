import { AppError } from '@/shared/errors/app-error';
import { IAppointmentRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository.interface';
import { RescheduleAppointmentRequest, RescheduleAppointmentResponse } from '@/domain/types/appointments/reschedule-appointment.type';
import { IRescheduleAppointmentUseCase } from '../interfaces/appointments/reschedule-appointment.use-case.interface';

export class RescheduleAppointmentUseCase implements IRescheduleAppointmentUseCase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(appointmentId: string, request: RescheduleAppointmentRequest): Promise<RescheduleAppointmentResponse> {
        // Validate input
        this.validateRequest(request);


        const appointment = await this.appointmentRepository.update(appointmentId, request);

        if (!appointment) {
            throw new AppError('Update appointment not found', 'APPOINTMENT_NOT_FOUND', 404);
        }

        // Return response
        return {
            success: true,
            message: 'Appointment updated successfully',
            timestamp: new Date().toISOString(),
            data: {
                appointmentId: appointment.id,
                date: appointment.date.toISOString(),
                time: appointment.time,
                reason: appointment.reason as string,
                status: appointment.status
            },
        };
    }

    private validateRequest(request: RescheduleAppointmentRequest): void {
        if (!request.newDate || !request.newTime || !request.reason) {
            throw new AppError('Invalid input data', 'USER_001', 400);
        }

    }
}